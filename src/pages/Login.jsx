import "../css/Login.css"

function Login() {
    return (
        <div className="login">
        <div className="login">
            <h2>Login</h2>
            <form>
                <input type="email" placeholder="Enter your email" /><br />
                <input type="password" placeholder="Enter password" /><br />
                <button>Login</button>
            </form>
        </div>
    );
}

export default Login;
