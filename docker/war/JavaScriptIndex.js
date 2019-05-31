function loginVerarbeiten() {
	let bnameS = document.getElementById('Benutzername').value;
	let passwdS = document.getElementById('Password').value;
	let sessionID = null;
	//alert("Login verarbeiten: " + bnameS + ", " + passwdS);
	$.ajax({
				url : "http://localhost:8080/FAPServer/service/fapservice/login",
				method: 'post',
				async: false,
				data : '{loginName:' + '"' + bnameS + '",'
						+ 'passwort:{passwort:' + '"' + passwdS + '"}}', 
				success : function(data, textStatus, jqxhr) { // Callback-Funktion
					sessionID = data.sessionID;
				},
				dataType : 'json',
				 contentType: 'application/json', //das wird geschickt
			});
	if (sessionID != null) {
		sessionStorage.setItem("sessionID", sessionID);
		return true;
	} else {
		alert("Benutzerkennung oder Passwort fehlerhaft!");
		return false;
	}
}