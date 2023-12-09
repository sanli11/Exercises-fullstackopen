const Notification = ({ message, error }) => {
  if (message === null) {
    return null;
  }

  let classNames = error ? "msg error" : "msg";

  return <div className={classNames}>{message}</div>;
};

export default Notification;
