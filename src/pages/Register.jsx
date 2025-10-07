import "../css/Register.css"

function Register() {
    return (
        <div className="register">
            <h2>Register</h2>
            <form>
                <input type="text" placeholder="Name" /><br />
                <input type="email" placeholder="Email" /><br />
                <input type="password" placeholder="Password" /><br />
                <button>Register</button>
            </form>
        </div>
    );
}

export default Register;
