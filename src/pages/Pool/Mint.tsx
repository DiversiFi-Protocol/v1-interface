import SingleColumnLayout from '@/layouts/SingleColumnLayout';

import MintForm from './PoolForms/MintForm';

export default function Mint() {
  return (
    <SingleColumnLayout>
      <div className="flexColumn w-[500px] pb-4 mx-auto">
        <MintForm />
      </div>
    </SingleColumnLayout>
  );
}
