import { GetServerSideProps } from 'next';

export const getServerSideProps: GetServerSideProps = async () => {
  return {
    redirect: {
      destination: '/stores/bengaluru',
      permanent: false
    }
  };
};

export default function StoresIndex() {
  return null;
}
