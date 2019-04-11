import { EditableListComponent, SectionComponent, TagInputComponent } from "@common-components";
import { lang, user } from "@core";
import { FacialProfile, ISOTeethArr, Lips, OralHygiene, OrthoCase } from "@modules";
import { num } from "@utils";
import { computed } from "mobx";
import { observer } from "mobx-react";
import {
	ConstrainMode,
	DetailsList,
	Dropdown,
	MessageBar,
	MessageBarType,
	SelectionMode,
	TextField
	} from "office-ui-fabric-react";
import * as React from "react";

@observer
export class OrthoCaseSheetPanel extends React.Component<{
	orthoCase: OrthoCase;
}> {
	@computed get canEdit() {
		return user.currentUser.canEditOrtho;
	}

	render() {
		return (
			<div>
				<SectionComponent title={lang(`Extra-Oral Features`)}>
					<Dropdown
						disabled={!this.canEdit}
						placeholder={lang("Lips competency")}
						options={Object.keys(Lips).map(x => ({
							key: x,
							text: lang((Lips as any)[x])
						}))}
						defaultSelectedKey={this.props.orthoCase.lips}
						onChange={(ev, has: any) => {
							this.props.orthoCase.lips = has.key;
						}}
					/>
					<Dropdown
						disabled={!this.canEdit}
						placeholder={lang("Facial profile")}
						options={Object.keys(FacialProfile).map(x => ({
							key: x,
							text: lang((FacialProfile as any)[x])
						}))}
						defaultSelectedKey={this.props.orthoCase.facialProfile}
						onChange={(ev, has: any) => {
							this.props.orthoCase.facialProfile = has.key;
						}}
					/>
					<Dropdown
						disabled={!this.canEdit}
						placeholder={lang("Oral hygiene")}
						options={Object.keys(OralHygiene).map(x => ({
							key: x,
							text: lang((OralHygiene as any)[x])
						}))}
						defaultSelectedKey={this.props.orthoCase.oralHygiene}
						onChange={(ev, has: any) => {
							this.props.orthoCase.oralHygiene = has.key;
						}}
					/>
					<TextField
						disabled={!this.canEdit}
						min={0}
						max={180}
						value={this.props.orthoCase.nasioLabialAngle.toString()}
						onChange={(ev, v) => {
							this.props.orthoCase.nasioLabialAngle = num(v!);
						}}
						type="number"
						prefix={lang(`Nasio-labial angle`)}
					/>
				</SectionComponent>

				<SectionComponent title={lang(`Jaw-Jaw Relationships`)}>
					<Dropdown
						disabled={!this.canEdit}
						placeholder={lang(`Skeletal relationship`)}
						options={[1, 2, 3].map(n => ({
							key: n.toString(),
							text: lang("Skeletal relationship: Class ") + n
						}))}
						defaultSelectedKey={this.props.orthoCase.skeletalRelationship.toString()}
						onChange={(ev, n) => {
							this.props.orthoCase.skeletalRelationship = num(
								n!.key
							);
						}}
					/>
					<Dropdown
						disabled={!this.canEdit}
						placeholder={lang(`Molars relationship`)}
						options={[1, 2, 3].map(n => ({
							key: n.toString(),
							text: lang("Molars relationship: Class ") + n
						}))}
						defaultSelectedKey={this.props.orthoCase.molarsRelationship.toString()}
						onChange={(ev, n) => {
							this.props.orthoCase.molarsRelationship = num(
								n!.key
							);
						}}
					/>
					<Dropdown
						disabled={!this.canEdit}
						placeholder={lang(`Canine relationship`)}
						options={[1, 2, 3].map(n => ({
							key: n.toString(),
							text: lang("Canine relationship: Class ") + n
						}))}
						defaultSelectedKey={this.props.orthoCase.canineRelationship.toString()}
						onChange={(ev, n) => {
							this.props.orthoCase.canineRelationship = num(
								n!.key
							);
						}}
					/>
				</SectionComponent>

				<SectionComponent
					title={lang(`Intercuspal-Interincisal Relationships`)}
				>
					<TextField
						disabled={!this.canEdit}
						type="number"
						prefix={lang(`Overjet`)}
						value={this.props.orthoCase.overJet.toString()}
						onChange={(ev, n) => {
							this.props.orthoCase.overJet = num(n!);
						}}
					/>
					<TextField
						disabled={!this.canEdit}
						type="number"
						prefix={lang(`Overbite`)}
						value={this.props.orthoCase.overBite.toString()}
						onChange={(ev, n) => {
							this.props.orthoCase.overBite = num(n!);
						}}
					/>
					<TagInputComponent
						disabled={!this.canEdit}
						strict
						placeholder={lang("Cross/scissors bite")}
						options={ISOTeethArr.map(x => {
							return {
								key: x.toString(),
								text: x.toString()
							};
						})}
						value={Array.from(
							this.props.orthoCase.crossScissorBite
						).map(x => ({
							key: x.toString(),
							text: x.toString()
						}))}
						onChange={newValue => {
							this.props.orthoCase.crossScissorBite = newValue.map(
								x => num(x.key)
							);
						}}
					/>
				</SectionComponent>

				<SectionComponent title={lang(`Upper Arch Space Analysis`)}>
					<TextField
						disabled={!this.canEdit}
						type="number"
						prefix={lang(`Space available`)}
						value={this.props.orthoCase.u_spaceAvailable.toString()}
						onChange={(ev, v) => {
							this.props.orthoCase.u_spaceAvailable = num(v!);
						}}
					/>
					<TextField
						disabled={!this.canEdit}
						type="number"
						prefix={lang(`Space required`)}
						value={this.props.orthoCase.u_spaceNeeded.toString()}
						onChange={(ev, v) => {
							this.props.orthoCase.u_spaceNeeded = num(v!);
						}}
					/>
					{this.props.orthoCase.u_crowding > 0 ? (
						<TextField
							type="number"
							disabled
							prefix={lang(`Crowding`)}
							value={this.props.orthoCase.u_crowding.toString()}
						/>
					) : (
						""
					)}

					{this.props.orthoCase.u_spacing > 0 ? (
						<TextField
							type="number"
							disabled
							prefix={lang(`Spacing`)}
							value={this.props.orthoCase.u_spacing.toString()}
						/>
					) : (
						""
					)}
				</SectionComponent>

				<SectionComponent title={lang(`Lower Arch Space Analysis`)}>
					<TextField
						type="number"
						prefix={lang(`Space available`)}
						disabled={!this.canEdit}
						value={this.props.orthoCase.l_spaceAvailable.toString()}
						onChange={(ev, v) => {
							this.props.orthoCase.l_spaceAvailable = num(v!);
						}}
					/>
					<TextField
						type="number"
						prefix={lang(`Space required`)}
						disabled={!this.canEdit}
						value={this.props.orthoCase.l_spaceNeeded.toString()}
						onChange={(ev, v) => {
							this.props.orthoCase.l_spaceNeeded = num(v!);
						}}
					/>
					{this.props.orthoCase.l_crowding > 0 ? (
						<TextField
							type="number"
							disabled
							prefix={lang(`Crowding`)}
							value={this.props.orthoCase.l_crowding.toString()}
						/>
					) : (
						""
					)}

					{this.props.orthoCase.l_spacing > 0 ? (
						<TextField
							type="number"
							disabled
							prefix={lang(`Spacing`)}
							value={this.props.orthoCase.l_spacing.toString()}
						/>
					) : (
						""
					)}
				</SectionComponent>

				<SectionComponent title={lang(`Problems`)}>
					<EditableListComponent
						disabled={!this.canEdit}
						label={lang("Patient concerns")}
						value={this.props.orthoCase.problemsList}
						onChange={v => {
							this.props.orthoCase.problemsList = v;
							this.props.orthoCase.triggerUpdate++;
						}}
					/>
					<br />
					<br />
					<h3>{lang("Other Problems")}</h3>
					{this.props.orthoCase.computedProblems.length === 0 ? (
						<MessageBar messageBarType={MessageBarType.info}>
							{lang(
								"The case sheet of this patient does not show any problems that needs orthodontic treatment"
							)}
						</MessageBar>
					) : (
						<DetailsList
							constrainMode={ConstrainMode.horizontalConstrained}
							compact
							items={[
								...this.props.orthoCase.computedProblems.map(
									(x, i) => [`${i + 1}. ${x}`]
								)
							]}
							isHeaderVisible={false}
							selectionMode={SelectionMode.none}
						/>
					)}
				</SectionComponent>
			</div>
		);
	}
}
