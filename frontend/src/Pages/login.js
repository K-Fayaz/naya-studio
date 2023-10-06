
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import axios from "axios";

import "../CSS/login.css";

const Login = ()=>{

    const navigate = useNavigate();
    const [username,setUsername] = useState("");
    const [password,setPassword] = useState("");

    /**
     * The handleChange function checks if the target element is the username input field or the
     * password input field, and updates the corresponding state variable and displays an error message
     * if the input does not meet the required length.
     * @param e - The parameter `e` is an event object that is passed to the `handleChange` function.
     * It contains information about the event that triggered the function, such as the target element
     * and the value of the input field.
     */
    function handleChange(e)
    {
        if(e.target.id == "username")
        {
            setUsername(e.target.value);
            if(username.length >= 3)
            {
                document.querySelector(".username p").innerText = "";
            }else{
                document.querySelector(".username p").innerText = "Username must be 3 charecters atlest";
            }

        }else{
            setPassword(e.target.value)
            if(password.length >= 8)
            {
                document.querySelector(".password p").innerText = "";
            }else{
                document.querySelector(".password p").innerText = "Password must be atleast three in length!!";
            }
        }
    }

    /**
     * The handleSubmit function is used to handle form submission, validate the username length, make
     * a POST request to a login endpoint with the username and password, and handle the response.
     * @param e - The parameter `e` is an event object that is passed to the `handleSubmit` function.
     * It is typically used to prevent the default form submission behavior by calling
     * `e.preventDefault()`.
     */
    function handleSubmit(e)
    {
        e.preventDefault();
        if(username.length >= 3)
        {
            document.querySelector(".username p").innerText = "";
        }else{
            document.querySelector(".username p").innerText = "Username must be 3 charecters atlest";
        }

        axios({
            method:"POST",
            url:"http://localhost:8080/auth/login",
            data:{
                username: username,
                password: password,
            },
            headers:{
                'Content-Type':'application/json',
            },
            withCredentials: true,
        })
        .then((data)=>{
            console.log(data.data);
            sessionStorage.setItem("user",data.data.user.username);
            navigate("/");
            // alert("Account Created");
        })
        .catch((err)=>{
            console.log(err);
            alert("Something Went Wrong !");
        })

    }
    return(
        <>
            <div className="login-container">
                {/* <div className="login-hero"></div> */}
                <div className="login-form-container">
                    <form className="form" onSubmit={handleSubmit}>
                        <h1>Login or Create Account</h1>
                        <div className="username field-container">
                            <input id="username" type="text" name="username" value={username} onChange={handleChange} placeholder="Enter Username"/>
                            <p style={{color: "red",fontSize: "12px",}}></p>
                        </div>
                        <div className="password field-container">
                            <input id="password" type="password" name="password" value={password} onChange={handleChange} placeholder="Enter Password" />
                            <p style={{color: "red",fontSize:"12px"}}></p>
                        </div>
                        <button className="form-btn">Login</button>
                    </form>
                </div>
            </div>
        </>
    )
}

export default Login;