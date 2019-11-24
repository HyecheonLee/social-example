import React from "react";

function UserSignupPage() {
    return (
        <div>
            <h1>가입</h1>
            <div>
                <input placeholder={"당신의 아이디"}/>
            </div>
            <div>
                <input placeholder={"당신의 성함"}/>
            </div>
            <div>
                <input type="password" placeholder={"당신의 비밀번호"}/>
            </div>
            <div>
                <input type="password" placeholder={"비밀번호 확인"}/>
            </div>
            <div>
                <button>가입</button>
            </div>
        </div>
    );
}

export default UserSignupPage;
