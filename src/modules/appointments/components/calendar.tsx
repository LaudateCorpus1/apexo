import * as React from "react";
import { API } from "../../../core";
import { Appointment, appointments, Calendar as CalendarClass } from "../data";
import { AppointmentEditor } from "./appointment-editor";
import { Col, Row } from "../../../assets/components/grid/index";
import { observable, computed } from "mobx";
import { Icon, TextField, Toggle } from "office-ui-fabric-react";
import { observer } from "mobx-react";
import { patientsComponents } from "../../patients";
import { ProfileSquared } from "../../../assets/components/profile/profile-squared";
import "./calendar.scss";
import { lang } from "../../../core/i18/i18";
import { name } from "../../../assets/utils/date";
import { num } from "../../../assets/utils/num";
import setting from "../../settings/data/data.settings";

@observer
export class Calendar extends React.Component<{}, {}> {
	@observable filter: string = "";

	c: CalendarClass = new CalendarClass();
	@observable appointment: Appointment | null = null;

	@observable showAll: boolean = true;

	componentDidMount() {
		this.unifyHeight();

		const dateString = API.router.currentLocation.split("/")[1];
		if (!dateString) {
			return;
		}
		const dateArray = dateString.split(/\W/);
		this.c.selectedYear = num(dateArray[0]);
		this.c.selectedMonth = num(dateArray[1]) - 1;
		this.c.selectedDay = num(dateArray[2]);
	}

	componentDidUpdate() {
		this.unifyHeight();
	}

	unifyHeight() {
		const parent = document.getElementById("full-day-cols");
		if (!parent) {
			return;
		}
		const els = document.getElementsByClassName(
			"full-day-col"
		) as HTMLCollectionOf<HTMLDivElement>;
		let largest = 0;
		for (let index = 0; index < els.length; index++) {
			const height = els[index].clientHeight;
			if (height > largest) {
				largest = height;
			}
		}
		for (let index = 0; index < els.length; index++) {
			els[index].style.minHeight = largest ? largest + "px" : "auto";
		}
	}

	render() {
		return (
			<div className="calendar-component container-fluid">
				<div className="selector year-selector">
					<Row>
						{[
							this.c.currentYear - 2,
							this.c.currentYear - 1,
							this.c.currentYear,
							this.c.currentYear + 1
						].map(year => {
							return (
								<Col key={year} span={6} className="centered">
									<a
										onClick={() => {
											this.c.selectedYear = year;
											this.c.selectedMonth = 0;
											this.c.selectedDay = 1;
										}}
										className={
											(this.c.selectedYear === year
												? "selected"
												: "") +
											(this.c.currentYear === year
												? " current"
												: "")
										}
									>
										{year}
									</a>
								</Col>
							);
						})}
					</Row>
				</div>
				<div className="selector month-selector">
					<Row>
						{name.monthsShort().map((monthShort, index) => {
							return (
								<Col
									key={monthShort}
									sm={2}
									xs={4}
									className="centered"
								>
									<a
										onClick={() => {
											this.c.selectedMonth = index;
											this.c.selectedDay = 1;
										}}
										className={
											(this.c.selectedMonth === index
												? "selected"
												: "") +
											(this.c.currentMonth === index &&
											this.c.currentYear ===
												this.c.selectedYear
												? " current"
												: "")
										}
									>
										{monthShort}
									</a>
								</Col>
							);
						})}
					</Row>
				</div>
				<div className="selector day-selector">
					<div className="day-selector-wrapper">
						<div>
							{this.c.selectedMonthDays.map(day => {
								return (
									<div
										key={day.dateNum}
										onClick={() => {
											this.c.selectedDay = day.dateNum;
											setTimeout(() => {
												scroll(
													0,
													this.findPos(
														document.getElementById(
															"day_" + day.dateNum
														)
													)
												);
											}, 0);
										}}
										className={
											"day-col" +
											(this.c.selectedDay === day.dateNum
												? " selected"
												: "") +
											(API.user.currentUser.onDutyDays.indexOf(
												day.weekDay.dayLiteral
											) === -1
												? " holiday"
												: "") +
											(day.weekDay.isWeekend
												? " weekend"
												: "")
										}
									>
										<div className="day-name">
											{lang(
												day.weekDay.dayLiteralShort
													.substr(0, 2)
													.toUpperCase()
											)}
										</div>
										<a
											className={
												"day-number info-row" +
												(day.dateNum ===
													this.c.currentDay &&
												this.c.currentMonth ===
													this.c.selectedMonth &&
												this.c.selectedYear ===
													this.c.currentYear
													? " current"
													: "")
											}
										>
											{day.dateNum}
										</a>
									</div>
								);
							})}
						</div>
						<div>
							{this.c.selectedMonthDays.map(day => {
								const number = appointments.appointmentsForDay(
									this.c.selectedYear,
									this.c.selectedMonth + 1,
									day.dateNum,
									undefined,
									this.showAll
										? undefined
										: API.user.currentUser._id
								).length;
								return (
									<div
										key={day.dateNum}
										onClick={() => {
											this.c.selectedDay = day.dateNum;
										}}
										className={
											"day-col" +
											(this.c.selectedDay === day.dateNum
												? " selected"
												: "") +
											(API.user.currentUser.onDutyDays.indexOf(
												day.weekDay.dayLiteral
											) === -1
												? " holiday"
												: "") +
											(day.weekDay.isWeekend
												? " weekend"
												: "")
										}
									>
										<div
											className={
												"info-row appointments-num num-" +
												number
											}
										>
											{number}
										</div>
									</div>
								);
							})}
						</div>
					</div>
				</div>
				<div className="week-view">
					<div className="filters">
						<Row>
							<Col sm={12} md={6} xs={24}>
								<Toggle
									defaultChecked={this.showAll}
									onText={lang("All appointments")}
									offText={lang("My appointments only")}
									onChange={(ev, newValue) => {
										this.showAll = newValue!;
									}}
								/>
							</Col>
							<Col sm={12} md={18} xs={0} className="filter">
								<TextField
									placeholder={lang("Type to filter")}
									onChange={(ev, newVal) =>
										(this.filter = newVal!)
									}
								/>
							</Col>
						</Row>
					</div>
					<div id="full-day-cols">
						{this.c.selectedWeekDays.map(day => {
							return (
								<div
									key={day.dateNum}
									id={"day" + "_" + day.dateNum}
									className={
										"full-day-col" +
										(API.user.currentUser.onDutyDays.indexOf(
											day.weekDay.dayLiteral
										) === -1
											? " holiday"
											: "") +
										(this.c.selectedDay === day.dateNum
											? " selected"
											: "")
									}
									onClick={() => {
										this.c.selectedDay = day.dateNum;
									}}
									style={{
										width:
											(
												100 /
												this.c.selectedWeekDays.length
											).toString() + "%"
									}}
								>
									<h4>
										<b>{day.dateNum}</b>
										&nbsp;&nbsp;&nbsp;
										<span className="day-name">
											{lang(day.weekDay.dayLiteral)}
										</span>
									</h4>
									{appointments
										.appointmentsForDay(
											this.c.selectedYear,
											this.c.selectedMonth + 1,
											day.dateNum,
											this.filter,
											this.showAll
												? undefined
												: API.user.currentUser._id
										)
										.sort((a, b) => a.date - b.date)
										.map(appointment => {
											return (
												<div
													key={appointment._id}
													className="appointment"
													onClick={() => {
														this.appointment =
															appointments.list[
																appointments.getIndexByID(
																	appointment._id
																)
															];
													}}
												>
													<div className="time">
														{
															appointment.formattedTime
														}
													</div>
													<div className="m-b-5">
														<ProfileSquared
															text={
																appointment.treatment
																	? appointment
																			.treatment
																			.type
																	: ""
															}
															size={1}
														/>
													</div>
													<patientsComponents.PatientLink
														id={
															appointment.patient
																._id
														}
													/>
													{appointment.operatingStaff.map(
														operator => {
															return (
																<div
																	key={
																		operator._id
																	}
																	className="m-t-5 fs-11"
																>
																	<Icon iconName="Contact" />{" "}
																	{
																		operator.name
																	}
																</div>
															);
														}
													)}
												</div>
											);
										})}
								</div>
							);
						})}
					</div>
				</div>
				<AppointmentEditor
					appointment={this.appointment}
					onDismiss={() => (this.appointment = null)}
					onDelete={() => (this.appointment = null)}
				/>
			</div>
		);
	}

	findPos(obj: HTMLElement | null) {
		let curtop = 0;
		if (obj && obj.offsetParent) {
			do {
				curtop += obj.offsetTop;
			} while ((obj = obj.offsetParent as HTMLElement));
			return curtop - 70;
		}
		return 0;
	}
}
