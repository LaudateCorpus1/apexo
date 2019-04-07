import * as React from "react";
import { API } from "../";
import { components } from "../";
import {
	MessageBar,
	PrimaryButton,
	Spinner,
	SpinnerSize
} from "office-ui-fabric-react";
import { observable } from "mobx";
import { observer } from "mobx-react";
import "./main.scss";
import { lang } from "../i18/i18";

@observer
export class ErrorBoundary extends React.Component<{}> {
	@observable hasError: boolean = false;
	@observable stackTrace: string = "";

	componentDidCatch(error: any, info: { componentStack: string }) {
		this.hasError = true;
		this.stackTrace = error.stack;
		console.log(
			error,
			error.stack,
			error.toString(),
			JSON.stringify(error),
			error.message,
			info
		);
	}

	render() {
		if (this.hasError) {
			return (
				<MessageBar className="eb" messageBarType={1}>
					Error occurred
					<br /> send a screenshot of the following details
					<textarea defaultValue={this.stackTrace} />
					<PrimaryButton
						onClick={() => {
							location.href = location.href.split("#")[0];
							location.reload();
						}}
						text={lang("Reload")}
					/>
				</MessageBar>
			);
		}
		return this.props.children;
	}
}

@observer
export class MainComponent extends React.Component<{}, {}> {
	componentDidCatch() {
		console.log("Error");
	}

	componentDidMount() {
		setInterval(() => {
			if (document.querySelectorAll(".ms-Panel").length) {
				document.querySelectorAll("html")[0].classList.add("has-panel");
			} else {
				document
					.querySelectorAll("html")[0]
					.classList.remove("has-panel");
			}
		}, 100);
	}

	render() {
		if (API.login.step === API.LoginStep.allDone) {
			return (
				<ErrorBoundary>
					<div className="main-component">
						<components.RouterComponent />
						<components.HeaderComponent />
						<components.MenuComponent />
					</div>
				</ErrorBoundary>
			);
		} else if (API.login.step === API.LoginStep.chooseUser) {
			return <components.ChooseUser />;
		} else if (API.login.step === API.LoginStep.initial) {
			return <components.LoginComponent />;
		} else {
			return (
				<div className="spinner-container">
					<Spinner
						size={SpinnerSize.large}
						label={lang(`Please wait`)}
					/>
				</div>
			);
		}
	}
}
