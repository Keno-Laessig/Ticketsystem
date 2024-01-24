sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator"
], function (Controller, JSONModel, Filter, FilterOperator) {
	"use strict";

	return Controller.extend("Ticketsystem.C", {

		onInit: function () {
			// Controller-Referenz
			var that = this;

			if (!this._dialog) {
				this._dialog = sap.ui.xmlfragment("Ticketsystem.login", this);
				this.getView().addDependent(this._dialog);
			}

			// open dialog
			jQuery.sap.syncStyleClass("sapUiSizeCompact", this.getView(), this._dialog);
			this._dialog.open();

			// Daten laden
			fetch('https://jsonplaceholder.typicode.com/todos/')
				.then(function (response) {
					return response.json();
				})
				.then(function (data) {
					// JSONModel erstellen und Daten setzen
					var oModel = new JSONModel(data);
					that.getView().setModel(oModel);
				})
				.catch(function (error) {
					// Fehlerbehandlung
					console.error('Error fetching data: ' + error.message);
				});
		},
		onSearch: function (oEvent) {
			// add filter for search
			var aFilters = [];
			var sQuery = oEvent.getSource().getValue();
			if (sQuery && sQuery.length > 0) {
				var oFilter = new Filter("title", FilterOperator.Contains, sQuery);
				aFilters.push(oFilter);
			}
			// update list binding
			this.byId("gridList").getBinding("items").filter(aFilters);
		},
		formatStatus: function (sValue) {
			if (sValue === "fertig") {
				return "Success";
			}
			else if (sValue === "in Bearbeitung") {
				return "Warning";
			}
			else if (sValue === "offen") {
				return "Error";
			}
			else {
				return "None";
			}
		},
		onTicketPress: function () {
			this._dialog = sap.ui.xmlfragment("Ticketsystem.changeTicket", this);
			this.getView().addDependent(this._dialog);
			// open dialog
			jQuery.sap.syncStyleClass("sapUiSizeCompact", this.getView(), this._dialog);
			this._dialog.open();
		},
		onRegisterButtonPress: function () {
			this._dialog.close()
			this._dialog = sap.ui.xmlfragment("Ticketsystem.register", this);
			this.getView().addDependent(this._dialog);
			// open dialog
			jQuery.sap.syncStyleClass("sapUiSizeCompact", this.getView(), this._dialog);
			this._dialog.open();
		},
		onRegisterCancelButtonPress: function () {
			this._dialog.close()
			this._dialog = sap.ui.xmlfragment("Ticketsystem.login", this);
			this.getView().addDependent(this._dialog);
			// open dialog
			jQuery.sap.syncStyleClass("sapUiSizeCompact", this.getView(), this._dialog);
			this._dialog.open();
		},
		onAddTicketButtonPress: function () {
			this._dialog = sap.ui.xmlfragment("Ticketsystem.addTicket", this);
			this.getView().addDependent(this._dialog);
			// open dialog
			jQuery.sap.syncStyleClass("sapUiSizeCompact", this.getView(), this._dialog);
			this._dialog.open();
		},
		onLoginButtonPress: function () {
			var loginMail = sap.ui.getCore().byId("mailInput").getValue();
			var loginPassword = sap.ui.getCore().byId("passwordInput").getValue();
			this.getView().byId("user").setText(loginMail);
			_timeout = jQuery.sap.delayedCall(0, this, function () {
				this._dialog.close()
			});
		},
		onaddTicketButtonPress: function () {
			var ticketTitel = sap.ui.getCore().byId("ticketTitelInput").getValue();
			var ticketDescription = sap.ui.getCore().byId("ticketDescriptionInput").getValue();
			var ticketRoom = sap.ui.getCore().byId("ticketRoomInput").getValue();
			_timeout = jQuery.sap.delayedCall(0, this, function () {
				this._dialog.close()
			});
		},
		onRegisterSubmitButtonPress: function () {
			var registerFirstName = sap.ui.getCore().byId("firstName").getValue();
			var registerLastName = sap.ui.getCore().byId("lastName").getValue();
			var registerMail = sap.ui.getCore().byId("mailInputRegister").getValue();
			var registerPassword = sap.ui.getCore().byId("passwordInputRegister").getValue();
			_timeout = jQuery.sap.delayedCall(0, this, function () {
				this._dialog.close()
			});

			var registerFirstName = sap.ui.getCore().byId("firstNameInput").getValue();
			var registerLastName = sap.ui.getCore().byId("lastNameInput").getValue();
			var registerMail = sap.ui.getCore().byId("mailInputRegister").getValue();
			var registerPassword = sap.ui.getCore().byId("passwordInputRegister").getValue();
			var registerRole = sap.ui.getCore().byId("roleInputRegister").getValue();

			const dataToSend = {
				Vorname: registerFirstName,
				Nachname: registerLastName,
				EMailAdresse: registerMail,
				Kennwort: registerPassword,
				Rolle: registerRole
			};

			const url = 'http://localhost:8080/addUser';
			let options={
				method: "POST",
				headers: new Headers({
					"Content-Type": "application/json;charset=utf-8"
			}),
			body: JSON.stringify(dataToSend)
		};
			fetch(url, options)
				.then(response => {
					if (!response.ok) {
						throw new Error('Network response was not ok');
					}
					return response.json();
				})
				.then(data => {
					// Erfolgreiche Antwort vom Server
					console.log('Daten erfolgreich gesendet:', data);
				})
				.catch(error => {
					// Fehler beim Senden der Daten
					console.error('Fehler beim Senden der Daten:', error);
				});

		},
		onCancelButtonPress: function () {
			_timeout = jQuery.sap.delayedCall(0, this, function () {
				this._dialog.close()
			});
		},
	});
});
