import SingleColumnLayout from '@/layouts/SingleColumnLayout';

import BurnForm from './PoolForms/BurnForm';

export default function Burn() {
  return (
    <SingleColumnLayout>
      <div className="flexColumn w-[500px] pb-4 mx-auto">
        <BurnForm />
      </div>
    </SingleColumnLayout>
  );
}
