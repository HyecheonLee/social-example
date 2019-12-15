import React from "react";
import {fireEvent, render} from "@testing-library/react";
import {MemoryRouter} from "react-router-dom";
import App from "./App";
import {Provider} from "react-redux";
import Axios from "axios";
import {waitForElement} from "@testing-library/dom";
import configureStore from "../redux/configureStore";


const setup = path => {
	const store = configureStore(false);
	return render(
		<Provider store={store}>
			<MemoryRouter initialEntries={[path]}>
				<App/>
			</MemoryRouter>
		</Provider>
	);
};

describe("App", () => {
	const changeEvent = value => {
		return {
			target: {
				value
			}
		};
	};
	it("displays homepage when url is /", () => {
		const {queryByTestId} = setup("/");
		expect(queryByTestId("homepage")).toBeInTheDocument();
	});
	it("dispalys LoginPage when url is /login", () => {
		const {container} = setup("/login");
		const header = container.querySelector("h1");
		expect(header).toHaveTextContent("Login");
	});
	it("displays only LoginPage when url is /login", () => {
		const {queryByTestId} = setup("/login");
		expect(queryByTestId("homepage")).not.toBeInTheDocument();
	});
	it("displays UserSignupPage when url is /signup", () => {
		const {container} = setup("/signup");
		const header = container.querySelector("h1");
		expect(header).toHaveTextContent("Sign up");
	});
	it("displays userpage when url is other than /, /login or /signup", () => {
		const {queryByTestId} = setup("/user1");
		expect(queryByTestId("UserPage")).toBeInTheDocument();
	});
	it("displays topBar when url is /", () => {
		const {container} = setup("/");
		const navigation = container.querySelector("nav");
		expect(navigation).toBeInTheDocument();
	});
	it("displays topBar when url is /login", () => {
		const {container} = setup("/login");
		const navigation = container.querySelector("nav");
		expect(navigation).toBeInTheDocument();
	});
	it("displays topBar when url is /signup", () => {
		const {container} = setup("/signup");
		const navigation = container.querySelector("nav");
		expect(navigation).toBeInTheDocument();
	});
	it("displays topBar when url is /user1", () => {
		const {container} = setup("/user1");
		const navigation = container.querySelector("nav");
		expect(navigation).toBeInTheDocument();
	});
	it("shows the UserSignupPage when clicking signup", () => {
		const {queryByText, container} = setup("/");
		const signupLink = queryByText("Sign Up");
		fireEvent.click(signupLink);
		const header = container.querySelector("h1");
		expect(header).toHaveTextContent("Sign up");
	});
	it("shows the LoginPage when clicking login", () => {
		const {queryByText, container} = setup("/");
		const loginLink = queryByText("Login");
		fireEvent.click(loginLink);
		const header = container.querySelector("h1");
		expect(header).toHaveTextContent("Login");
	});
	it("shows the HomePage when clicking the login", () => {
		const {queryByTestId, container} = setup("/login");
		const logo = container.querySelector("img");
		fireEvent.click(logo);
		expect(queryByTestId("homepage")).toBeInTheDocument();
	});
	it("displays My Profile on TopBar after login success", async () => {
		const {queryByPlaceholderText, container, queryByText} = setup("/login");
		const usernameInput = queryByPlaceholderText("Your username");
		fireEvent.change(usernameInput, changeEvent('my-user-name'));
		const passwordInput = queryByPlaceholderText("Your password");
		fireEvent.change(passwordInput, changeEvent("P4ssword"));
		const button = container.querySelector("button");
		Axios.post = jest.fn().mockResolvedValue({
			data: {
				id: 1,
				username: "user1",
				displayName: "display1",
				image: "profile1.png"
			}
		});
		fireEvent.click(button);
		const myProfileLink = await waitForElement(() => queryByText("My Profile"));
		expect(myProfileLink).toBeInTheDocument();
	});
	it("displays My Profile on TopBar after signup success", async () => {
		const {queryByPlaceholderText, container, queryByText} = setup("/signup");
		const displayNameInput = queryByPlaceholderText("Your display name");
		const usernameInput = queryByPlaceholderText("Your username");
		const passwordInput = queryByPlaceholderText("Your password");
		const passwordRepeatInput = queryByPlaceholderText("Repeat your password");


		fireEvent.change(displayNameInput, changeEvent("display1"));
		fireEvent.change(usernameInput, changeEvent("user1"));
		fireEvent.change(passwordInput, changeEvent("P4ssword"));
		fireEvent.change(passwordRepeatInput, changeEvent("P4ssword"));

		const button = container.querySelector("button");
		Axios.post = jest.fn().mockResolvedValue({
			data: {
				message: "User saved"
			}
		}).mockResolvedValueOnce({
			data: {
				id: 1,
				username: "user1",
				displayName: "display1",
				image: "profile1.png"
			}
		});
		fireEvent.click(button);
		const myProfileLink = await waitForElement(() => queryByText("My Profile"));
		expect(myProfileLink).toBeInTheDocument();
	});
});
