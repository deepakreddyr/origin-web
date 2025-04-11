const AccountDelContent = () => {

  return (
    <div style={{ fontSize: '18px', marginTop: '1.5rem', padding: '2rem' }}>
      <h2>Steps to be taken to delete your account</h2>

      <ul style={{ marginLeft: '2rem' }}>
        <li>Enter phone number to check your account deletion status</li>
      </ul>

      <ul style={{ marginLeft: '2rem' }}>
        <li>
          If not deleted enter your phone number and OTP to request for account
          deletion
        </li>
      </ul>

      <ul style={{ marginLeft: '2rem' }}>
        <li>
          Once request is send, your account will be deleted within 24 hrs.
        </li>
      </ul>

      <p style={{ marginTop: '3rem' }}>
        Note: All the data which we are collected during registration (name,
        email, address etc.) will be deleted.
      </p>
    </div>
  );
};

export default AccountDelContent;
