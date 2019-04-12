import "./gallery.scss";
import { fileTypes, PickAndUploadComponent, SectionComponent } from "@common-components";
import { files, GALLERIES_DIR, status, text, user } from "@core";
import { Patient, setting } from "@modules";
import { diff } from "fast-array-diff";
import { computed, observable, observe } from "mobx";
import { observer } from "mobx-react";
import { Icon, IconButton, MessageBar, MessageBarType, TooltipHost } from "office-ui-fabric-react";
import * as React from "react";

@observer
export class PatientGalleryPanel extends React.Component<
	{ patient: Patient },
	{}
> {
	@computed get canEdit() {
		return user.currentUser.canEditPatients;
	}

	@observable uploading: boolean = false;

	@observable selectedImagePath: string = "";

	@observable imagesTable: { [key: string]: string } = {};

	@computed get selectedImageURI() {
		return this.imagesTable[this.selectedImagePath];
	}

	stopObservation: () => void = function() {};

	render() {
		return (
			<SectionComponent title={text(`Patient Gallery`)}>
				{status.online ? (
					status.dropboxActive ? (
						<div className="spg-p">
							{this.props.patient.gallery.length === 0 ? (
								<MessageBar
									messageBarType={MessageBarType.info}
								>
									{text(
										"This patient does not seem to have any photo record uploaded, press the plus sign button below to start uploading"
									)}
								</MessageBar>
							) : (
								""
							)}
							<br />
							<div className="thumbs">
								{this.canEdit ? (
									this.uploading ? (
										<Icon
											iconName="sync"
											className="rotate"
											style={{ padding: 10 }}
										/>
									) : (
										<PickAndUploadComponent
											allowMultiple={true}
											accept={fileTypes.image}
											onFinish={paths => {
												this.props.patient.gallery.push(
													...paths
												);
											}}
											onStartLoading={() => {
												this.uploading = true;
											}}
											onFinishLoading={() => {
												this.uploading = false;
											}}
											targetDir={`${GALLERIES_DIR}/${
												this.props.patient._id
											}`}
										>
											<TooltipHost
												content={text("Add photo")}
											>
												<IconButton
													className={`add-photo`}
													iconProps={{
														iconName: "Photo2Add"
													}}
												/>
											</TooltipHost>
										</PickAndUploadComponent>
									)
								) : (
									""
								)}
								{Object.keys(this.imagesTable).map(
									imagePath => {
										const URI = this.imagesTable[imagePath];
										return URI ? (
											<span
												className={`thumb ${
													this.selectedImagePath ===
													imagePath
														? "selected"
														: ""
												}`}
												key={imagePath}
												style={{
													backgroundImage: `url('${
														URI ? URI : ""
													}')`
												}}
												onClick={() => {
													this.selectedImagePath = imagePath;
												}}
											/>
										) : (
											<div
												key={imagePath + "-placeholder"}
												className="placeholder"
											>
												<Icon
													iconName="sync"
													className="rotate"
												/>
											</div>
										);
									}
								)}
							</div>
							{this.selectedImagePath ? (
								<div className="viewport">
									<img
										key={this.selectedImagePath}
										src={this.selectedImageURI}
									/>
									{this.canEdit ? (
										<IconButton
											className="delete-photo"
											iconProps={{ iconName: "trash" }}
											onClick={async () => {
												await this.removeImage(
													this.selectedImagePath
												);
												this.selectedImagePath = "";
											}}
										/>
									) : (
										""
									)}
								</div>
							) : (
								""
							)}
						</div>
					) : (
						<MessageBar messageBarType={MessageBarType.warning}>
							{text(
								"A valid DropBox access token is required for this section"
							)}
						</MessageBar>
					)
				) : (
					<MessageBar messageBarType={MessageBarType.warning}>
						{text(
							"You can not access patient gallery while offline"
						)}
					</MessageBar>
				)}
				<div style={{ clear: "both" }} />
			</SectionComponent>
		);
	}

	componentDidMount() {
		this.props.patient.gallery.forEach(async path => {
			await this.addImage(path);
		});
		this.stopObservation = this.observe();
	}

	componentWillUnmount() {
		this.stopObservation();
	}

	async addImage(path: string) {
		this.imagesTable[path] = "";
		const uri = await files.get(path);
		this.imagesTable[path] = uri;
		return;
	}

	async removeImage(path: string) {
		await files.remove(this.selectedImagePath);
		const selectedImageIndex = this.props.patient.gallery.indexOf(
			this.selectedImagePath
		);
		this.props.patient.gallery.splice(selectedImageIndex, 1);
		delete this.imagesTable[path];
		return;
	}

	observe() {
		return observe(this.props.patient, change => {
			if (change.name === "gallery") {
				const diffResult = diff(
					Object.keys(this.imagesTable),
					this.props.patient.gallery
				);
				diffResult.added.forEach(path => {
					this.addImage(path);
				});
				diffResult.removed.forEach(path => {
					this.removeImage(path);
				});
			}
		});
	}
}
