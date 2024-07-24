import { DashBoardCard } from "../../../component/DashBoardCard"

const AdminHome: React.FC = (): JSX.Element => {
  return (
    <>
      <div className="sm:w-full sm:p-5 sm:flex sm:items-center sm:justify-between gap-3">
        <DashBoardCard header="Total Theaters" data="12" />
        <DashBoardCard header="Total Movies" data="23" />
        <DashBoardCard header="Total Users" data="50" />
      </div>
    </>
  )
}

export default AdminHome