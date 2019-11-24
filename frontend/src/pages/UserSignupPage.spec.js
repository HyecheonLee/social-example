import React from "react";
import {render, cleanup} from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import UserSignupPage from "./UserSignupPage";

beforeEach(cleanup);

describe("UserSignupPage", () => {
    describe("Layout", () => {
        it("has header of Sign Up", () => {
            const {container} = render(<UserSignupPage/>);
            const header = container.querySelector("h1");
            expect(header).toHaveTextContent("가입");
        });
        it('has input for display name', () => {
            let {queryByPlaceholderText} = render(<UserSignupPage/>);
            let displayNameInput = queryByPlaceholderText('당신의 아이디');
            expect(displayNameInput).toBeInTheDocument();
        });
        it('has input for name', () => {
            let {queryByPlaceholderText} = render(<UserSignupPage/>);
            let usernameInput = queryByPlaceholderText('당신의 성함');
            expect(usernameInput).toBeInTheDocument();
        });
        it('has input for password', () => {
            let {queryByPlaceholderText} = render(<UserSignupPage/>);
            let passwordInput = queryByPlaceholderText('당신의 비밀번호');
            expect(passwordInput).toBeInTheDocument();
        });
        it('has password type for password input', () => {
            let {queryByPlaceholderText} = render(<UserSignupPage/>);
            let passwordInput = queryByPlaceholderText('당신의 비밀번호');
            expect(passwordInput.type).toBe('password');
        });
        it('has input for password repeat', () => {
            let {queryByPlaceholderText} = render(<UserSignupPage/>);
            let passwordRepeat = queryByPlaceholderText('비밀번호 확인');
            expect(passwordRepeat).toBeInTheDocument();
        });
        it('has password type for password repeat input', () => {
            let {queryByPlaceholderText} = render(<UserSignupPage/>);
            let passwordRepeat = queryByPlaceholderText('비밀번호 확인');
            expect(passwordRepeat.type).toBe('password');
        });
        it('has submit button', () => {
            let {container} = render(<UserSignupPage/>);
            let button = container.querySelector('button');
            expect(button).toBeInTheDocument();
        });
    });
});
