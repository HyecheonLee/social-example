import React, {useState} from "react";

function UserSignupPage({actions}) {
    let [state, setState] = useState({
        displayName: "",
        username: "",
        password: "",
        passwordRepeat: "",
        pendingApiCall: false
    });

    const onChange = (e) => {
        const {name, value} = e.target;
        setState({
            ...state,
            [name]: value
        })
    };
    const onClickSignup = (e) => {
        if (actions) {
            const user = {
                username: state.username,
                displayName: state.displayName,
                password: state.password,
            };
            setState({...state, pendingApiCall: true});
            actions.postSignup(user)
                .then(response => {
                    setState({...state, pendingApiCall: false});
                })
                .catch(error => {
                    setState({...state, pendingApiCall: false});
                });
        }
    };
    return (
        <div className="container">
            <h1 className="text-center">가입</h1>
            <div className="col-12 mb-3">
                <label>아이디</label>
                <input
                    className="form-control"
                    name={"displayName"} value={state.displayName} onChange={onChange}
                    placeholder={"당신의 아이디"}/>
            </div>
            <div className="col-12 mb-3">
                <label>이름</label>
                <input className="form-control" name={"username"} value={state.username} onChange={onChange}
                       placeholder={"당신의 성함"}/>
            </div>
            <div className="col-12 mb-3">
                <label>비밀번호</label>
                <input className="form-control" name={"password"} value={state.password} type="password"
                       onChange={onChange}
                       placeholder={"당신의 비밀번호"}/>
            </div>
            <div className="col-12 mb-3">
                <label>비밀번호 확인</label>
                <input className="form-control" name={"passwordRepeat"} value={state.passwordRepeat} type="password"
                       onChange={onChange}
                       placeholder={"비밀번호 확인"}/>
            </div>
            <div className="text-center">
                <button disabled={state.pendingApiCall} className="btn btn-primary" onClick={onClickSignup}>
                    {state.pendingApiCall && (
                        <div className="spinner-border text-light spinner-border-sm mr-sm-1" role="status">
                            <span className="sr-only">Loading...</span>
                        </div>)}
                    가입
                </button>
            </div>
        </div>
    );
}

UserSignupPage.defaultProps = {
    actions: {
        postSignup: () => new Promise((resolve, reject) => {
            resolve({});
        })
    }
};
export default UserSignupPage;
