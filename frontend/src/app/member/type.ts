export type Member = {
  FirstName: string;
  LastName: string;
};

export type Package = {
  packName: string;
  Enddate: string;
  PackPrice: number;
};

export type Locker = {
  EndDate: string;
} | null;

export type UpcomingClass = {
  Schedule_ID: number;
  ClassName: string;
  ClassDate: string;
  ClassTime: string;
};

export type DashboardData = {
  member: Member | null;
  package: Package | null;
  locker: Locker;
  upcoming_classes: UpcomingClass[];
  checked_today: boolean;
};