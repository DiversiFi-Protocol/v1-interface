import { Outlet } from 'react-router-dom';

export default function Pool() {
  return (
    <div className="flexColumn gap-0.5">
      <Outlet />
    </div>
  );
}
