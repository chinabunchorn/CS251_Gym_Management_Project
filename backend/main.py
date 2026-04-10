from fastapi import Depends, FastAPI, HTTPException
from dependencies import require_member,require_trainer,require_manager,get_current_user_any_role
from database import get_connection
from auth import verify_password, create_access_token, seconds_to_time
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from auth import hash_password  

app = FastAPI()

#Handle CORS
origins = [
    "http://localhost:3000",  # For Next.js dev server only
    #Add Frontend Deployed URL later
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class UserLogin(BaseModel):
    username: str
    password: str


@app.get("/trainers")
def get_trainers(user=Depends(get_current_user_any_role)):

    conn = get_connection()
    cursor = conn.cursor(dictionary=True)

    query = """
    SELECT 
        e.EmployeeID,
        e.FirstName,
        e.LastName,
        t.Specialty,
        e.StartDate,
        e.STATUS,
        e.Contract_Type
    FROM Trainer t
    JOIN Employee e
        ON t.EmployeeID = e.EmployeeID
    ORDER BY e.EmployeeID
    """

    cursor.execute(query)
    result = cursor.fetchall()

    cursor.close()
    conn.close()

    return result

@app.get("/equipment")
def get_equipment(user=Depends(get_current_user_any_role)):

    conn = get_connection()
    cursor = conn.cursor(dictionary=True)

    query = """
    SELECT Equipment_ID, Equipment, STATUS, Import_Date
    FROM Gym_Equipment
    ORDER BY Equipment_ID
    """

    cursor.execute(query)
    result = cursor.fetchall()

    cursor.close()
    conn.close()

    return result

@app.get("/promotions")
def get_promotions(user=Depends(get_current_user_any_role)):

    conn = get_connection()
    cursor = conn.cursor(dictionary=True)

    query = """
    SELECT
        PromoCode,
        DiscountRate,
        StartDate,
        EndDate
    FROM Promotion
    ORDER BY StartDate DESC
    """

    cursor.execute(query)
    result = cursor.fetchall()

    cursor.close()
    conn.close()

    return result

@app.get("/lockers")
def get_lockers(user=Depends(get_current_user_any_role)):

    conn = get_connection()
    cursor = conn.cursor(dictionary=True)

    query = """
    SELECT
        l.LockerID,
        l.Zone,
        l.STATUS,
        CONCAT(m.FirstName, ' ', m.LastName) AS MemberName
    FROM Locker l
    LEFT JOIN Rent r
        ON l.LockerID = r.LockerID
        AND r.EndDate >= CURDATE()
    LEFT JOIN Member m
        ON r.Member_ID = m.Member_ID
    ORDER BY l.LockerID
    """

    cursor.execute(query)
    result = cursor.fetchall()

    cursor.close()
    conn.close()

    return result

@app.get("/classes")
def get_classes(user=Depends(get_current_user_any_role)):

    conn = get_connection()
    cursor = conn.cursor(dictionary=True)

    query = """
    SELECT
        cc.ClassName,
        CONCAT(e.FirstName, ' ', e.LastName) AS InstructorName,
        cs.ClassDate,
        cs.ClassTime,
        cc.Capacity,

        (
            SELECT COUNT(*)
            FROM Reserves r
            WHERE r.Schedule_ID = cs.Schedule_ID
        ) AS ReservedCount

    FROM Class_Schedule cs
    JOIN Class_Catalog cc
        ON cs.ClassID = cc.ClassID
    JOIN Leads l
        ON cs.Schedule_ID = l.Schedule_ID
    JOIN Employee e
        ON l.EmployeeID = e.EmployeeID

    ORDER BY cs.ClassDate, cs.ClassTime
    """

    cursor.execute(query)
    classes = cursor.fetchall()

    cursor.close()
    conn.close()

    return classes

@app.get("/profile/{member_id}")
def get_idiv_member(member_id: int,user=Depends(get_current_user_any_role)):

    conn = get_connection()
    cursor = conn.cursor(dictionary=True)

    query = """
    SELECT *
    FROM member
    WHERE Member_ID = %s
    """

    cursor.execute(query, (member_id,))
    member = cursor.fetchone()

    cursor.close()
    conn.close()

    return member

@app.get("/members")
def get_members(user=Depends(get_current_user_any_role)):

    conn = get_connection()
    cursor = conn.cursor(dictionary=True)

    query = """
    SELECT 
        m.Member_ID,
        m.FirstName,
        m.LastName,
        p.PackName,
        s.P_method,
        m.MedRec,
        CASE 
            WHEN s.Enddate >= CURDATE() THEN 'Paid'
            ELSE 'Expired'
        END AS PaymentStatus
    FROM Member m
    JOIN Subscribes_to s
        ON m.Member_ID = s.Member_ID
    JOIN Package p
        ON s.PackageID = p.PackageID
    ORDER BY m.Member_ID
    """

    cursor.execute(query)
    result = cursor.fetchall()

    cursor.close()
    conn.close()

    return result
    
@app.get("/trainer/me")
def get_current_trainer(user = Depends(require_trainer)):

    trainer_id = user["id"]
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)

    query = """
        SELECT e.FirstName, e.LastName, t.Specialty
        FROM Trainer t
        JOIN Employee e ON t.EmployeeID = e.EmployeeID
        WHERE e.EmployeeID = %s;
    """
    cursor.execute(query, (trainer_id,))
    result = cursor.fetchone()

    if result is None:
        raise HTTPException(status_code=404, detail="Trainer not found")

    return {
        "first_name": result["FirstName"],
        "last_name": result["LastName"],
        "Specialty": result["Specialty"]
    }

@app.get("/trainer/classes")
def trainer_classes(user=Depends(require_trainer)):

    employee_id = user["id"]

    conn = get_connection()
    cursor = conn.cursor(dictionary=True)

    query = """
    SELECT 
        cc.ClassName AS class_name,
        cs.ClassDate AS class_date,
        cs.ClassTime AS class_time,
        cc.Capacity AS capacity,
        COUNT(r.Member_ID) AS applied
    FROM Leads l
    JOIN Class_Schedule cs
        ON l.Schedule_ID = cs.Schedule_ID
    JOIN Class_Catalog cc
        ON cs.ClassID = cc.ClassID
    LEFT JOIN Reserves r
        ON cs.Schedule_ID = r.Schedule_ID
    WHERE l.EmployeeID = %s
    GROUP BY cs.Schedule_ID, cc.ClassName, cs.ClassDate, cs.ClassTime, cc.Capacity
    ORDER BY cs.ClassDate, cs.ClassTime
    """

    cursor.execute(query, (employee_id,))
    result = cursor.fetchall()

    for row in result:
        row["class_time"] = seconds_to_time(row["class_time"])

    cursor.close()
    conn.close()

    return result
    

@app.get("/trainer/schedule")
def trainer_schedule(user=Depends(require_trainer)):

    employee_id = user["id"]

    conn = get_connection()
    cursor = conn.cursor(dictionary=True)

    query = """
    SELECT
        cs.Schedule_ID,
        cc.ClassName,
        cs.ClassDate,
        cs.ClassTime,
        cc.Capacity,

        CONCAT(e.FirstName, ' ', e.LastName) AS InstructorName,

        (
            SELECT COUNT(*)
            FROM Reserves r
            WHERE r.Schedule_ID = cs.Schedule_ID
        ) AS ReservedCount,

        CASE
            WHEN cs.ClassDate = CURDATE()
                 AND cs.ClassTime <= CURTIME()
            THEN 'In Progress'
            WHEN cs.ClassDate > CURDATE()
            THEN 'Upcoming'
            ELSE 'Completed'
        END AS Status

    FROM Leads l
    JOIN Class_Schedule cs
        ON l.Schedule_ID = cs.Schedule_ID
    JOIN Class_Catalog cc
        ON cs.ClassID = cc.ClassID
    JOIN Employee e
        ON l.EmployeeID = e.EmployeeID

    WHERE l.EmployeeID = %s

    ORDER BY cs.ClassDate, cs.ClassTime
    """

    cursor.execute(query, (employee_id,))
    result = cursor.fetchall()

    cursor.close()
    conn.close()

    return result

@app.get("/trainer/clients")
def get_trainer_clients(user=Depends(require_trainer)):

    employee_id = user["id"]

    conn = get_connection()
    cursor = conn.cursor(dictionary=True)

    query = """
    SELECT
        m.Member_ID,
        CONCAT(m.FirstName, ' ', m.LastName) AS FullName,
        TIMESTAMPDIFF(YEAR, m.Bdate, CURDATE()) AS Age,
        t.Status,
        t.StartDate
    FROM Trains t
    JOIN Member m
        ON t.Member_ID = m.Member_ID
    WHERE t.EmployeeID = %s
    AND t.Status = 'Active'
    ORDER BY m.FirstName
    """

    cursor.execute(query, (employee_id,))
    result = cursor.fetchall()

    cursor.close()
    conn.close()

    return result

@app.get("/member/dashboard")
def member_dashboard(user=Depends(require_member)):

    member_id = user["id"]

    conn = get_connection()
    cursor = conn.cursor(dictionary=True)


    # MEMBER INFO
    cursor.execute("""
        SELECT FirstName, LastName
        FROM Member
        WHERE Member_ID = %s
    """, (member_id,))
    member = cursor.fetchone()


    # PACKAGE INFO
    cursor.execute("""
        SELECT
            p.packName,
            s.Enddate,
            s.Startdate,
            s.P_method,
            p.PackPrice
        FROM Subscribes_to s
        JOIN Package p
            ON s.packageID = p.packageID
        WHERE s.Member_ID = %s
        ORDER BY s.Enddate DESC
        LIMIT 1
    """, (member_id,))
    package = cursor.fetchone()


    # LOCKER INFO
    cursor.execute("""
        SELECT
            l.LockerID,
            r.EndDate
        FROM Rent r
        JOIN Locker l
            ON r.LockerID = l.LockerID
        WHERE r.Member_ID = %s
        AND r.EndDate >= CURDATE()
        LIMIT 1
    """, (member_id,))
    locker = cursor.fetchone()


    # TRAINER INFO
    cursor.execute("""
        SELECT
            CONCAT(e.FirstName,' ',e.LastName) AS TrainerName
        FROM Trains t
        JOIN Employee e
            ON t.EmployeeID = e.EmployeeID
        WHERE t.Member_ID = %s
        AND t.Status = 'Active'
        LIMIT 1
    """, (member_id,))
    trainer = cursor.fetchone()


    # UPCOMING CLASSES
    cursor.execute("""
        SELECT
            cc.ClassName,
            cs.ClassDate,
            cs.ClassTime
        FROM Reserves r
        JOIN Class_Schedule cs
            ON r.Schedule_ID = cs.Schedule_ID
        JOIN Class_Catalog cc
            ON cs.ClassID = cc.ClassID
        WHERE r.Member_ID = %s
        AND cs.ClassDate >= CURDATE()
        ORDER BY cs.ClassDate
        LIMIT 2
    """, (member_id,))
    upcoming_classes = cursor.fetchall()


    # CHECK-IN TODAY STATUS
    cursor.execute("""
        SELECT COUNT(*) AS checked_today
        FROM Attendance
        WHERE Member_ID = %s
        AND Date = CURDATE()
    """, (member_id,))
    checkin = cursor.fetchone()


    cursor.close()
    conn.close()


    return {
        "member": member,
        "package": package,
        "locker": locker,
        "trainer": trainer,
        "upcoming_classes": upcoming_classes,
        "checked_today": checkin["checked_today"] > 0
    }
@app.get("/member/locker")
def get_member_locker(user=Depends(require_member)):

    member_id = user["id"]

    conn = get_connection()
    cursor = conn.cursor(dictionary=True)

    query = """
    SELECT
        l.LockerID,
        l.Zone,
        l.STATUS,
        r.StartDate,
        r.EndDate,
        DATEDIFF(r.EndDate, r.StartDate) AS RentDurationDays
    FROM Rent r
    JOIN Locker l
        ON r.LockerID = l.LockerID
    WHERE r.Member_ID = %s
    AND r.EndDate >= CURDATE()
    LIMIT 1
    """

    cursor.execute(query, (member_id,))
    locker = cursor.fetchone()

    cursor.close()
    conn.close()

    return locker

@app.get("/dashboard/stats")
def get_dashboard_stats(user=Depends(get_current_user_any_role)):

    conn = get_connection()
    cursor = conn.cursor(dictionary=True)


    # count all members
    cursor.execute("""
        SELECT COUNT(*) AS total_members
        FROM Member
    """)
    members = cursor.fetchone()["total_members"]


    # count active trainers
    cursor.execute("""
        SELECT COUNT(*) AS total_trainers
        FROM Trainer t
        JOIN Employee e
            ON t.EmployeeID = e.EmployeeID
        WHERE e.STATUS = 'Active'
    """)
    trainers = cursor.fetchone()["total_trainers"]


    cursor.close()
    conn.close()

    return {
        "total_members": members,
        "active_trainers": trainers
    }

@app.post("/login/member")
def member_login(payload: UserLogin):

    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM Member WHERE Username = %s", (payload.username,))
    user = cursor.fetchone()
    cursor.close()
    conn.close()

    if not user or not verify_password(payload.password, user["PASSWORD"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = create_access_token({"sub": user["Username"], "role": "member"})
    print("Login attempt:", payload.username, payload.password)
    print("User fetched from DB:", user)
    return {"access_token": token, "token_type": "bearer", "role": "member"}

@app.post("/login/employee")
def employee_login(payload: UserLogin):

    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM Employee WHERE Username = %s", (payload.username,))
    user = cursor.fetchone()
    cursor.close()
    conn.close()

    if not user or not verify_password(payload.password, user["PASSWORD"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = create_access_token({"sub": user["Username"], "role": "employee"})
    print("Login attempt:", payload.username, payload.password)
    print("User fetched from DB:", user)
    return {"access_token": token, "token_type": "bearer", "role": "employee"}

@app.post("/login")
def login(payload: UserLogin):

    conn = get_connection()
    cursor = conn.cursor(dictionary=True)

    # Check Member table
    cursor.execute(
        "SELECT * FROM Member WHERE Username = %s",
        (payload.username,)
    )
    user = cursor.fetchone()

    if user:
        role = "member"

    else:
        # Check Employee table
        cursor.execute(
            "SELECT * FROM Employee WHERE Username = %s",
            (payload.username,)
        )
        user = cursor.fetchone()

        if not user:
            cursor.close()
            conn.close()
            raise HTTPException(status_code=401, detail="Invalid credentials")

        employee_id = user["EmployeeID"]

        # Check Manager table
        cursor.execute(
            "SELECT * FROM Manager WHERE EmployeeID = %s",
            (employee_id,)
        )

        if cursor.fetchone():
            role = "manager"

        else:
            # Check Trainer table
            cursor.execute(
                "SELECT * FROM Trainer WHERE EmployeeID = %s",
                (employee_id,)
            )

            if cursor.fetchone():
                role = "trainer"
            else:
                role = "employee"


    # Verify password BEFORE closing connection
    if not verify_password(payload.password, user["PASSWORD"]):
        cursor.close()
        conn.close()
        raise HTTPException(status_code=401, detail="Invalid credentials")


    # Create token (now includes ID ✅)
    token = create_access_token({
        "sub": user["Username"],
        "role": role,
        "id": user.get("Member_ID") or user.get("EmployeeID")
    })

    cursor.close()
    conn.close()

    return {
        "access_token": token,
        "token_type": "bearer",
        "role": role
    }

@app.post("/attendance/checkin")
def checkin_member(member_id: int,user=Depends(get_current_user_any_role)):

    conn = get_connection()
    cursor = conn.cursor()

    query = """
    INSERT INTO Attendance (Member_ID, Date, Time)
    SELECT %s, CURDATE(), CURTIME()
    FROM Subscribes_to
    WHERE Member_ID = %s
    AND Enddate >= CURDATE()
    LIMIT 1
    """

    cursor.execute(query, (member_id, member_id))
    conn.commit()

    if cursor.rowcount == 0:
        cursor.close()
        conn.close()
        return {"message": "Membership expired or member not found"}

    cursor.close()
    conn.close()

    return {
        "message": "Check-in recorded successfully",
        "Member_ID": member_id
    }

@app.post("/trainer/assign-class")
def assign_trainer(employee_id: int, schedule_id: int,user=Depends(get_current_user_any_role)):

    conn = get_connection()
    cursor = conn.cursor(dictionary=True)


    # Check trainer exists
    trainer_check = """
    SELECT EmployeeID
    FROM Trainer
    WHERE EmployeeID = %s
    """

    cursor.execute(trainer_check, (employee_id,))
    trainer = cursor.fetchone()

    if trainer is None:
        cursor.close()
        conn.close()
        return {"message": "Trainer not found"}


    # Check schedule exists
    schedule_check = """
    SELECT Schedule_ID
    FROM Class_Schedule
    WHERE Schedule_ID = %s
    """

    cursor.execute(schedule_check, (schedule_id,))
    schedule = cursor.fetchone()

    if schedule is None:
        cursor.close()
        conn.close()
        return {"message": "Schedule not found"}


    # Assign trainer to class
    insert_query = """
    INSERT INTO Leads (EmployeeID, Schedule_ID)
    VALUES (%s, %s)
    """

    cursor.execute(insert_query, (employee_id, schedule_id))
    conn.commit()

    cursor.close()
    conn.close()

    return {
        "message": "Trainer assigned successfully",
        "EmployeeID": employee_id,
        "Schedule_ID": schedule_id
    }

@app.post("/class/require-equipment")
def require_equipment(class_id: str, equipment_id: str,user=Depends(get_current_user_any_role)):

    conn = get_connection()
    cursor = conn.cursor(dictionary=True)


    # check class exists
    class_check = """
    SELECT ClassID
    FROM class_catalog
    WHERE ClassID = %s
    """

    cursor.execute(class_check, (class_id,))
    class_exists = cursor.fetchone()

    if class_exists is None:
        cursor.close()
        conn.close()
        return {"message": "Class not found"}


    # check equipment exists
    equipment_check = """
    SELECT Equipment_ID
    FROM Gym_Equipment
    WHERE Equipment_ID = %s
    """

    cursor.execute(equipment_check, (equipment_id,))
    equipment_exists = cursor.fetchone()

    if equipment_exists is None:
        cursor.close()
        conn.close()
        return {"message": "Equipment not found"}


    # insert relationship
    insert_query = """
    INSERT INTO Requires (ClassID, Equipment_ID)
    VALUES (%s, %s)
    """

    cursor.execute(insert_query, (
        class_id,
        equipment_id
    ))

    conn.commit()

    cursor.close()
    conn.close()

    return {
        "message": "Equipment assigned to class successfully",
        "ClassID": class_id,
        "Equipment_ID": equipment_id
    }


@app.post("/reserve")
def reserve_class(member_id: int, schedule_id: int,user=Depends(get_current_user_any_role)):

    conn = get_connection()
    cursor = conn.cursor()

    query = """
    INSERT INTO Reserves (Member_ID, Schedule_ID)
    VALUES (%s, %s)
    """

    cursor.execute(query, (member_id, schedule_id))
    conn.commit()

    cursor.close()
    conn.close()

    return {"message": "Class reserved successfully"}

@app.post("/locker/rent")
def rent_locker(
    locker_id: str,
    member_id: int,
    payment_method: str,
    end_date: str,
    price: float
):

    conn = get_connection()
    cursor = conn.cursor(dictionary=True)

    # Step 1: check locker availability first
    check_query = """
    SELECT STATUS
    FROM Locker
    WHERE LockerID = %s
    """

    cursor.execute(check_query, (locker_id,))
    locker = cursor.fetchone()

    if locker is None:
        cursor.close()
        conn.close()
        return {"message": "Locker not found"}

    if locker["STATUS"] == "Occupied":
        cursor.close()
        conn.close()
        return {"message": "Locker already Occupied"}


    # Step 2: insert rental record
    rent_query = """
    INSERT INTO Rent
    (LockerID, Member_ID, P_method, StartDate, EndDate, Price)
    VALUES (%s, %s, %s, CURDATE(), %s, %s)
    """

    cursor.execute(rent_query, (
        locker_id,
        member_id,
        payment_method,
        end_date,
        price
    ))


    # Step 3: update locker status
    update_query = """
    UPDATE Locker
    SET STATUS = 'Occupied'
    WHERE LockerID = %s
    """

    cursor.execute(update_query, (locker_id,))


    conn.commit()

    cursor.close()
    conn.close()

    return {
        "message": "Locker rented successfully",
        "LockerID": locker_id
    }


@app.post("/member/create")
def create_member(
    firstname: str,
    lastname: str,
    password: str,
    bdate: str,
    medrec: str,
    weight: float,
    height: float,
    package_id: str,
    trainer_id: int,
    user=Depends(get_current_user_any_role)
):

    conn = get_connection()
    cursor = conn.cursor()

    # auto-generate username from firstname
    username = firstname.lower()

    # hash password
    hashed_pw = hash_password(password)

    member_query = """
    INSERT INTO Member
    (Username, Password, FirstName, LastName, Bdate, MedRec, Weight, Height)
    VALUES (%s,%s,%s,%s,%s,%s,%s,%s)
    """

    cursor.execute(member_query, (
        username,
        hashed_pw,
        firstname,
        lastname,
        bdate,
        medrec,
        weight,
        height
    ))

    member_id = cursor.lastrowid


    subscribe_query = """
    INSERT INTO Subscribes_to
    (packageID, Member_ID, Startdate, Enddate, P_method)
    VALUES
    (%s,%s,CURDATE(),DATE_ADD(CURDATE(), INTERVAL 1 MONTH),'PromptPay')
    """

    cursor.execute(subscribe_query, (
        package_id,
        member_id
    ))


    trainer_query = """
    INSERT INTO Trains
    (EmployeeID, Member_ID, Status, StartDate)
    VALUES
    (%s,%s,'Active',CURDATE())
    """

    cursor.execute(trainer_query, (
        trainer_id,
        member_id
    ))

    conn.commit()

    cursor.close()
    conn.close()

    return {
        "message": "Member created successfully",
        "Member_ID": member_id,
        "Username": username
    }


@app.post("/employee/create")
def create_employee(
    firstname: str,
    lastname: str,
    salary: float,
    username: str,
    password: str,
    manager_id: int = None,
    contract_type: str = "Full-time",
    specialty: str = None,
    user=Depends(get_current_user_any_role)
):

    conn = get_connection()
    cursor = conn.cursor()

    hashed_pw = hash_password(password)

    # Insert Employee
    employee_query = """
    INSERT INTO Employee
    (FirstName, LastName, Salary, STATUS,
     Username, PASSWORD, ManagerID,
     StartDate, Contract_Type)
    VALUES (%s,%s,%s,'Active',
            %s,%s,%s,
            CURDATE(),%s)
    """

    cursor.execute(employee_query, (
        firstname,
        lastname,
        salary,
        username,
        hashed_pw,
        manager_id,
        contract_type
    ))

    employee_id = cursor.lastrowid

    trainer_query = """
    INSERT INTO Trainer
    (EmployeeID, Specialty)
    VALUES (%s,%s)
    """

    cursor.execute(trainer_query, (
        employee_id,
        specialty
    ))

    conn.commit()

    cursor.close()
    conn.close()

    return {
        "message": "Trainer created successfully",
        "EmployeeID": employee_id
    }

@app.post("/locker/create")
def create_locker(locker_id: str, zone: str,user=Depends(get_current_user_any_role)):

    conn = get_connection()
    cursor = conn.cursor(dictionary=True)

    # Check if locker already exists
    check_query = """
    SELECT LockerID
    FROM Locker
    WHERE LockerID = %s
    """

    cursor.execute(check_query, (locker_id,))
    existing = cursor.fetchone()

    if existing:
        cursor.close()
        conn.close()
        return {"message": "Locker already exists"}

    # Insert new locker
    insert_query = """
    INSERT INTO Locker (LockerID, STATUS, Zone)
    VALUES (%s, 'Available', %s)
    """

    cursor.execute(insert_query, (locker_id, zone))
    conn.commit()

    cursor.close()
    conn.close()

    return {
        "message": "Locker created successfully",
        "LockerID": locker_id
    }

@app.post("/equipment/create")
def create_equipment(
    equipment_id: str,
    equipment_name: str,
    import_date: str,
    user=Depends(get_current_user_any_role)
):

    conn = get_connection()
    cursor = conn.cursor(dictionary=True)

    # check duplicate equipment id
    check_query = """
    SELECT Equipment_ID
    FROM Gym_Equipment
    WHERE Equipment_ID = %s
    """

    cursor.execute(check_query, (equipment_id,))
    exists = cursor.fetchone()

    if exists:
        cursor.close()
        conn.close()
        return {"message": "Equipment already exists"}


    insert_query = """
    INSERT INTO Gym_Equipment
    (Equipment_ID, Equipment, STATUS, Import_Date)
    VALUES (%s, %s, 'Available', %s)
    """

    cursor.execute(insert_query, (
        equipment_id,
        equipment_name,
        import_date
    ))

    conn.commit()

    cursor.close()
    conn.close()

    return {
        "message": "Equipment created successfully",
        "Equipment_ID": equipment_id
    }



@app.post("/class/create-full")
def create_full_class(
    class_id: str,
    class_name: str,
    description: str,
    capacity: int,
    class_date: str,
    class_time: str,
    employee_id: int,
    user=Depends(get_current_user_any_role)
):

    conn = get_connection()
    cursor = conn.cursor(dictionary=True)

    try:

        # 1️⃣ check class already exists
        cursor.execute("""
            SELECT ClassID
            FROM class_catalog
            WHERE ClassID = %s
        """, (class_id,))

        if cursor.fetchone():
            return {"message": "Class already exists"}


        # 2️⃣ create class
        cursor.execute("""
            INSERT INTO class_catalog
            (ClassID, ClassName, Description, Capacity)
            VALUES (%s, %s, %s, %s)
        """, (
            class_id,
            class_name,
            description,
            capacity
        ))


        # 3️⃣ create schedule
        cursor.execute("""
            INSERT INTO class_schedule
            (ClassID, ClassDate, ClassTime)
            VALUES (%s, %s, %s)
        """, (
            class_id,
            class_date,
            class_time
        ))

        schedule_id = cursor.lastrowid


        # 4️⃣ assign trainer
        cursor.execute("""
            INSERT INTO leads
            (EmployeeID, Schedule_ID)
            VALUES (%s, %s)
        """, (
            employee_id,
            schedule_id
        ))


        conn.commit()

        return {
            "message": "Class created successfully",
            "Schedule_ID": schedule_id
        }


    except Exception as e:

        conn.rollback()
        return {"error": str(e)}


    finally:
        cursor.close()
        conn.close()


@app.post("/promotion/create")
def create_promotion(
    promo_code: str,
    discount_rate: float,
    package_id: str,
    start_date: str,
    end_date: str,
    user=Depends(get_current_user_any_role)
):

    conn = get_connection()
    cursor = conn.cursor(dictionary=True)


    # check promo already exists
    check_query = """
    SELECT PromoCode
    FROM Promotion
    WHERE PromoCode = %s
    """

    cursor.execute(check_query, (promo_code,))
    exists = cursor.fetchone()

    if exists:
        cursor.close()
        conn.close()
        return {"message": "PromoCode already exists"}


    # insert promotion
    promo_query = """
    INSERT INTO Promotion
    (PromoCode, DiscountRate, StartDate, EndDate)
    VALUES (%s, %s, %s, %s)
    """

    cursor.execute(promo_query, (
        promo_code,
        discount_rate,
        start_date,
        end_date
    ))


    # link promotion to package
    apply_query = """
    INSERT INTO Applies_to
    (packageID, PromoCode)
    VALUES (%s, %s)
    """

    cursor.execute(apply_query, (
        package_id,
        promo_code
    ))


    conn.commit()

    cursor.close()
    conn.close()

    return {
        "message": "Promotion created successfully",
        "PromoCode": promo_code
    }

@app.post("/package/create")
def create_package(
    package_id: str,
    pack_name: str,
    pack_price: float,
    duration: int,
    user=Depends(get_current_user_any_role)
):

    conn = get_connection()
    cursor = conn.cursor(dictionary=True)

    # check duplicate packageID
    check_query = """
    SELECT packageID
    FROM Package
    WHERE packageID = %s
    """

    cursor.execute(check_query, (package_id,))
    exists = cursor.fetchone()

    if exists:
        cursor.close()
        conn.close()
        return {"message": "Package already exists"}


    insert_query = """
    INSERT INTO Package
    (packageID, packName, PackPrice, Duration)
    VALUES (%s, %s, %s, %s)
    """

    cursor.execute(insert_query, (
        package_id,
        pack_name,
        pack_price,
        duration
    ))

    conn.commit()

    cursor.close()
    conn.close()

    return {
        "message": "Package created successfully",
        "packageID": package_id
    }

@app.put("/employee/update")
def update_employee(employee_id: int, salary: float, status: str,user=Depends(get_current_user_any_role)):

    conn = get_connection()
    cursor = conn.cursor()

    query = """
    UPDATE Employee
    SET Salary = %s,
        STATUS = %s
    WHERE EmployeeID = %s
    """

    cursor.execute(query, (salary, status, employee_id))
    conn.commit()

    cursor.close()
    conn.close()

    return {"message": "Employee updated successfully"}

@app.put("/trainer/update")
def update_trainer(employee_id: int, specialty: str,user=Depends(get_current_user_any_role)):

    conn = get_connection()
    cursor = conn.cursor()

    query = """
    UPDATE Trainer
    SET Specialty = %s
    WHERE EmployeeID = %s
    """

    cursor.execute(query, (specialty, employee_id))
    conn.commit()

    cursor.close()
    conn.close()

    return {"message": "Trainer specialty updated successfully"}

@app.put("/equipment/update")
def update_equipment(equipment_id: str, status: str,user=Depends(get_current_user_any_role)):

    conn = get_connection()
    cursor = conn.cursor()

    query = """
    UPDATE Gym_Equipment
    SET STATUS = %s
    WHERE Equipment_ID = %s
    """

    cursor.execute(query, (status, equipment_id))
    conn.commit()

    if cursor.rowcount == 0:
        cursor.close()
        conn.close()
        return {"message": "Equipment not found"}

    cursor.close()
    conn.close()

    return {
        "message": "Equipment status updated successfully",
        "Equipment_ID": equipment_id,
        "New_Status": status
    }

@app.put("/trainer/member/update-status")
def update_trainer_member_status(
    employee_id: int,
    member_id: int,
    status: str,
    user=Depends(get_current_user_any_role)
):

    conn = get_connection()
    cursor = conn.cursor()

    query = """
    UPDATE Trains
    SET Status = %s
    WHERE EmployeeID = %s
    AND Member_ID = %s
    """

    cursor.execute(query, (
        status,
        employee_id,
        member_id
    ))

    conn.commit()

    if cursor.rowcount == 0:
        cursor.close()
        conn.close()
        return {"message": "Relationship not found"}

    cursor.close()
    conn.close()

    return {
        "message": "Trainer-member status updated successfully"
    }

# ==========================================
# MANAGER ROUTES: UPDATE (PUT) & DELETE (DELETE)
# ==========================================

# 1. Class
@app.put("/manager/class/update")
def manager_update_class(
    class_id: str,
    class_name: str,
    description: str,
    capacity: int,
    class_date: str,
    class_time: str,
    employee_id: int,
    user=Depends(require_manager)
):
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    try:
        cursor.execute("""
            UPDATE class_catalog
            SET ClassName = %s, Description = %s, Capacity = %s
            WHERE ClassID = %s
        """, (class_name, description, capacity, class_id))

        cursor.execute("""
            UPDATE class_schedule
            SET ClassDate = %s, ClassTime = %s
            WHERE ClassID = %s
        """, (class_date, class_time, class_id))

        cursor.execute("SELECT Schedule_ID FROM class_schedule WHERE ClassID = %s", (class_id,))
        schedule = cursor.fetchone()
        if schedule:
            cursor.execute("""
                UPDATE leads
                SET EmployeeID = %s
                WHERE Schedule_ID = %s
            """, (employee_id, schedule["Schedule_ID"]))

        conn.commit()
        return {"message": "Class updated successfully"}
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=400, detail=str(e))
    finally:
        cursor.close()
        conn.close()

@app.delete("/manager/class/delete/{class_id}")
def manager_delete_class(class_id: str, user=Depends(require_manager)):
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    try:
        cursor.execute("SELECT Schedule_ID FROM class_schedule WHERE ClassID = %s", (class_id,))
        schedules = cursor.fetchall()

        for sch in schedules:
            sch_id = sch["Schedule_ID"]
            cursor.execute("DELETE FROM reserves WHERE Schedule_ID = %s", (sch_id,))
            cursor.execute("DELETE FROM leads WHERE Schedule_ID = %s", (sch_id,))

        cursor.execute("DELETE FROM class_schedule WHERE ClassID = %s", (class_id,))
        cursor.execute("DELETE FROM requires WHERE ClassID = %s", (class_id,))
        cursor.execute("DELETE FROM class_catalog WHERE ClassID = %s", (class_id,))

        conn.commit()
        return {"message": "Class deleted successfully"}
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=400, detail=str(e))
    finally:
        cursor.close()
        conn.close()

# 2. Member
@app.put("/manager/member/update")
def manager_update_member(
    member_id: int,
    firstname: str,
    lastname: str,
    password: str,
    bdate: str,
    medrec: str,
    weight: float,
    height: float,
    package_id: str,
    trainer_id: int,
    user=Depends(require_manager)
):
    conn = get_connection()
    cursor = conn.cursor()
    try:
        hashed_pw = hash_password(password)
        cursor.execute("""
            UPDATE Member
            SET FirstName=%s, LastName=%s, PASSWORD=%s, Bdate=%s, MedRec=%s, Weight=%s, Height=%s
            WHERE Member_ID=%s
        """, (firstname, lastname, hashed_pw, bdate, medrec, weight, height, member_id))

        cursor.execute("""
            UPDATE Subscribes_to
            SET packageID=%s
            WHERE Member_ID=%s AND Enddate >= CURDATE()
        """, (package_id, member_id))

        cursor.execute("""
            UPDATE Trains
            SET EmployeeID=%s
            WHERE Member_ID=%s AND Status='Active'
        """, (trainer_id, member_id))

        conn.commit()
        return {"message": "Member updated successfully"}
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=400, detail=str(e))
    finally:
        cursor.close()
        conn.close()

@app.delete("/manager/member/delete/{member_id}")
def manager_delete_member(member_id: int, user=Depends(require_manager)):
    conn = get_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("DELETE FROM attendance WHERE Member_ID = %s", (member_id,))
        cursor.execute("DELETE FROM rent WHERE Member_ID = %s", (member_id,))
        cursor.execute("DELETE FROM reserves WHERE Member_ID = %s", (member_id,))
        cursor.execute("DELETE FROM subscribes_to WHERE Member_ID = %s", (member_id,))
        cursor.execute("DELETE FROM trains WHERE Member_ID = %s", (member_id,))
        cursor.execute("DELETE FROM Member WHERE Member_ID = %s", (member_id,))
        conn.commit()
        return {"message": "Member deleted successfully"}
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=400, detail=str(e))
    finally:
        cursor.close()
        conn.close()

# 3. Trainer
@app.put("/manager/trainer/update")
def manager_update_trainer(
    employee_id: int,
    firstname: str,
    lastname: str,
    salary: float,
    username: str,
    password: str,
    manager_id: int = None,
    contract_type: str = "Full-time",
    specialty: str = None,
    user=Depends(require_manager)
):
    conn = get_connection()
    cursor = conn.cursor()
    try:
        hashed_pw = hash_password(password)
        cursor.execute("""
            UPDATE Employee
            SET FirstName=%s, LastName=%s, Salary=%s, Username=%s, PASSWORD=%s, ManagerID=%s, Contract_Type=%s
            WHERE EmployeeID=%s
        """, (firstname, lastname, salary, username, hashed_pw, manager_id, contract_type, employee_id))

        cursor.execute("""
            UPDATE Trainer
            SET Specialty=%s
            WHERE EmployeeID=%s
        """, (specialty, employee_id))

        conn.commit()
        return {"message": "Trainer updated successfully"}
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=400, detail=str(e))
    finally:
        cursor.close()
        conn.close()

@app.delete("/manager/trainer/delete/{employee_id}")
def manager_delete_trainer(employee_id: int, user=Depends(require_manager)):
    conn = get_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("DELETE FROM trains WHERE EmployeeID = %s", (employee_id,))
        cursor.execute("DELETE FROM leads WHERE EmployeeID = %s", (employee_id,))
        cursor.execute("DELETE FROM Trainer WHERE EmployeeID = %s", (employee_id,))
        cursor.execute("DELETE FROM Manager WHERE EmployeeID = %s", (employee_id,))
        cursor.execute("DELETE FROM Employee WHERE EmployeeID = %s", (employee_id,))
        conn.commit()
        return {"message": "Trainer deleted successfully"}
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=400, detail=str(e))
    finally:
        cursor.close()
        conn.close()

# 4. Promotion
@app.put("/manager/promotion/update")
def manager_update_promotion(
    promo_code: str,
    discount_rate: float,
    package_id: str,
    start_date: str,
    end_date: str,
    user=Depends(require_manager)
):
    conn = get_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("""
            UPDATE Promotion
            SET DiscountRate=%s, StartDate=%s, EndDate=%s
            WHERE PromoCode=%s
        """, (discount_rate, start_date, end_date, promo_code))

        cursor.execute("""
            UPDATE Applies_to
            SET packageID=%s
            WHERE PromoCode=%s
        """, (package_id, promo_code))

        conn.commit()
        return {"message": "Promotion updated successfully"}
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=400, detail=str(e))
    finally:
        cursor.close()
        conn.close()

@app.delete("/manager/promotion/delete/{promo_code}")
def manager_delete_promotion(promo_code: str, user=Depends(require_manager)):
    conn = get_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("DELETE FROM applies_to WHERE PromoCode = %s", (promo_code,))
        cursor.execute("DELETE FROM Promotion WHERE PromoCode = %s", (promo_code,))
        conn.commit()
        return {"message": "Promotion deleted successfully"}
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=400, detail=str(e))
    finally:
        cursor.close()
        conn.close()

# 5. Locker
@app.put("/manager/locker/update")
def manager_update_locker(
    locker_id: str,
    zone: str,
    user=Depends(require_manager)
):
    conn = get_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("UPDATE Locker SET Zone=%s WHERE LockerID=%s", (zone, locker_id))
        conn.commit()
        return {"message": "Locker updated successfully"}
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=400, detail=str(e))
    finally:
        cursor.close()
        conn.close()

@app.delete("/manager/locker/delete/{locker_id}")
def manager_delete_locker(locker_id: str, user=Depends(require_manager)):
    conn = get_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("DELETE FROM rent WHERE LockerID = %s", (locker_id,))
        cursor.execute("DELETE FROM Locker WHERE LockerID = %s", (locker_id,))
        conn.commit()
        return {"message": "Locker deleted successfully"}
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=400, detail=str(e))
    finally:
        cursor.close()
        conn.close()

# 6. Equipment
@app.put("/manager/equipment/update")
def manager_update_equipment(
    equipment_id: str,
    equipment_name: str,
    import_date: str,
    user=Depends(require_manager)
):
    conn = get_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("""
            UPDATE Gym_Equipment
            SET Equipment=%s, Import_Date=%s
            WHERE Equipment_ID=%s
        """, (equipment_name, import_date, equipment_id))
        conn.commit()
        return {"message": "Equipment updated successfully"}
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=400, detail=str(e))
    finally:
        cursor.close()
        conn.close()

@app.delete("/manager/equipment/delete/{equipment_id}")
def manager_delete_equipment(equipment_id: str, user=Depends(require_manager)):
    conn = get_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("DELETE FROM requires WHERE Equipment_ID = %s", (equipment_id,))
        cursor.execute("DELETE FROM Gym_Equipment WHERE Equipment_ID = %s", (equipment_id,))
        conn.commit()
        return {"message": "Equipment deleted successfully"}
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=400, detail=str(e))
    finally:
        cursor.close()
        conn.close()
