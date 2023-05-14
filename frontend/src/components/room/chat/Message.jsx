const Message = ({ message, written_as, is_own }) => {
    const messageClass = `mb-2 text-break py-2 px-3 border rounded
    ${is_own ? "bg-primary text-white ms-auto" : ""}
    d-flex`;
    const boxClass = `message-box fw-bold
  ${is_own ? "ms-auto" : ""}
  d-flex`;

    return (
        <div className="d-flex flex-column align-items-start">
            <span className={boxClass}>{written_as}</span>
            <p className={messageClass} style={{ maxWidth: "75%" }}>
                {message}
            </p>
        </div>
    );
};

export default Message;