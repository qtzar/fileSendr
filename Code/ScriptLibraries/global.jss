function checkAuth(){
	print("fileSendr : Checking Authorization");
	if (context.getUser().getCommonName() == "Anonymous"){
		sessionScope.put("entryPage",context.getUrl().getPath() + context.getUrl().getQueryString())
		context.redirectToPage("/login.xsp");
	}
}

function checkBrowser(){
	print("fileSendr : Checking Browser Type");
	sessionScope.put("browserType","browser")
	// The following is commented out till the other interfaces are ready
	// var browserType = context.getUserAgent().getUserAgent();
	// if (browserType.match("iPhone")){
	//	sessionScope.put("browserType","iPhone");}
	// if (browserType.match("iPad")){
	//	sessionScope.put("browserType","iPad");}
	// if (browserType.match("Blackberry")){
	//	sessionScope.put("browserType","blackberry");}
	// if (browserType.match("Android")){
	//	sessionScope.put("browserType","Android");}
}

function checkTheme(browserName){
	print("fileSendr : Checking XSP Theme");
	if (browserName == "browser"){
		if (context.getSessionProperty("xsp.theme") != browserName + "_" + applicationScope.appThemeVersion + "_" + applicationScope.appTheme){
			context.setSessionProperty("xsp.theme",browserName+ "_" + applicationScope.appThemeVersion + "_" + applicationScope.appTheme);
			var thisPage = context.getUrl().getAddress();
			var thisPage = context.getUrl().toString();
			context.redirectToPage(thisPage);
		}
	}
}

function initSession(){
	print("fileSendr : Initializing sessionScope Cache");
	// Quick Access To The Users Roles.
	sessionScope.put("Config",false);
	sessionScope.put("Debug",false);
	if(@Contains(context.getUser().getRoles(),"[Config]") == @True()){
		sessionScope.put("Config",true);
	}
	if(@Contains(context.getUser().getRoles(),"[Debug]") == @True()){
		sessionScope.put("Debug",true);
	}
	
	sessionScope.commonName = context.getUser().getCommonName();
	sessionScope.init = true;
	
}

function initApplication() {
		print("fileSendr : Initializing applicationScope Cache");
	// Find The Active Blog Configuration Document.
	var configView:NotesView = database.getView("lkp_cfg_ActiveConfig");
	var configDoc:NotesDocument = configView.getFirstDocument();
	if (configDoc == null ){
		initialConfig();
		configView.refresh();
		var configDoc:NotesDocument = configView.getFirstDocument();
	}
	// Basics
	applicationScope.appName = configDoc.getItemValueString("cfg_basic_appName");
	applicationScope.appDesc = configDoc.getItemValueString("cfg_basic_appDesc");
	applicationScope.appFooter = configDoc.getItemValueString("cfg_basic_appFooter");
	applicationScope.enableSend = configDoc.getItemValueString("cfg_basic_enableSend");
	applicationScope.enableReceive = configDoc.getItemValueString("cfg_basic_enableReceive");
	// Sending
	applicationScope.fileStorage = configDoc.getItemValueString("cfg_basic_storage");
	applicationScope.MaxDownload = configDoc.getItemValueInteger("cfg_basic_MaxDownload");
	applicationScope.MaxHistory = configDoc.getItemValueInteger("cfg_basic_MaxHistory");
	applicationScope.AWSS3Bucket = configDoc.getItemValueString("cfg_AWS_S3Bucket");
	// Receiving
	applicationScope.receiveStorage = configDoc.getItemValueString("cfg_basic_receiveStorage");
	applicationScope.receiveMaxUpload = configDoc.getItemValueInteger("cfg_basic_receiveMaxUpload");
	applicationScope.receiveMaxHistory = configDoc.getItemValueInteger("cfg_basic_receiveMaxHistory");
	applicationScope.receiveAWSS3Bucket = configDoc.getItemValueString("cfg_AWS_ReceiveS3Bucket");
	// Layout
	applicationScope.appTheme = configDoc.getItemValueString("cfg_basic_appTheme");
	applicationScope.appThemeVersion = configDoc.getItemValueString("cfg_basic_appThemeVersion");
	// Login
	applicationScope.loginMarketTitle = configDoc.getItemValueString("cfg_login_market_title");
	applicationScope.loginMarketText = configDoc.getItemValueString("cfg_login_market_text");
	applicationScope.loginLegal1 = configDoc.getItemValueString("cfg_login_legal1");
	applicationScope.loginLegal2 = configDoc.getItemValueString("cfg_login_legal2");
	// Sending Email
	applicationScope.emailPreSubject = configDoc.getItemValueString("cfg_email_subject");
	applicationScope.emailDirectLink = configDoc.getItemValueString("cfg_email_direct");
	applicationScope.emailIndirectLink = configDoc.getItemValueString("cfg_email_indirect");
	applicationScope.emailFooter = configDoc.getItemValueString("cfg_email_footer");
	applicationScope.emailFromOverride = configDoc.getItemValueString("cfg_email_fromOverride");
	applicationScope.emailFromAddress = configDoc.getItemValueString("cfg_email_fromAddress");
	// Receiving EMail
	applicationScope.receiveemailPreSubject = configDoc.getItemValueString("cfg_email_receivesubject");
	applicationScope.receiveemailDirectLink = configDoc.getItemValueString("cfg_email_receivedirect");
	applicationScope.receiveemailIndirectLink = configDoc.getItemValueString("cfg_email_receiveindirect");
	applicationScope.receiveemailFooter = configDoc.getItemValueString("cfg_email_receivefooter");
	// AWS
	applicationScope.AWSAccessKey = configDoc.getItemValueString("cfg_AWS_Accesskey");
	applicationScope.AWSSecretKey = configDoc.getItemValueString("cfg_AWS_Secretkey");

	applicationScope.put("init",true)
}

function initialConfig(){
		print("fileSendr : Creating New Default Configuration Document");
	// Used For The First Time A Person Opens This Application.
	// Builds The Default Configuration.
	var thisDB:NotesDatabase = sessionAsSigner.getDatabase(session.getServerName(),session.getCurrentDatabase().getFilePath());
	var newConfigDoc:NotesDocument = thisDB.createDocument();
	newConfigDoc.replaceItemValue("Form","cfg_Config");
	// Basic
	newConfigDoc.replaceItemValue("cfg_basic_appName","fileSendr V1.2.0");
	newConfigDoc.replaceItemValue("cfg_basic_appDesc","The XPages File Distribution System");
	newConfigDoc.replaceItemValue("cfg_basic_appFooter","Powered By fileSendr V1.1.0");
	newConfigDoc.replaceItemValue("cfg_basic_enableSend","true");
	newConfigDoc.replaceItemValue("cfg_basic_enableReceive","true");
	// Sending
	newConfigDoc.replaceItemValue("cfg_basic_storage","local");
	newConfigDoc.replaceItemValue("cfg_basic_MaxDownload",14);
	newConfigDoc.replaceItemValue("cfg_basic_MaxHistory",30);
	newConfigDoc.replaceItemValue("cfg_AWS_S3Bucket","-- PUT YOUR SEND BUCKET NAME HERE --");
	// Receiving
	newConfigDoc.replaceItemValue("cfg_basic_receiveStorage","local");
	newConfigDoc.replaceItemValue("cfg_basic_receiveMaxUpload",14);
	newConfigDoc.replaceItemValue("cfg_basic_receiveMaxHistory",30);
	newConfigDoc.replaceItemValue("cfg_AWS_ReceiveS3Bucket","-- PUT YOUR RECEIVE BUCKET NAME HERE --");
	// Layout
	newConfigDoc.replaceItemValue("cfg_basic_appTheme","blue");
	newConfigDoc.replaceItemValue("cfg_basic_appThemeVersion","2");
	// Login
	newConfigDoc.replaceItemValue("cfg_login_market_title","What Can You Do With fileSendr?");
	newConfigDoc.replaceItemValue("cfg_login_market_text","Need to send a 500MB file to somebody but their email gateway is rejecting it because it's too big? Then fileSendr is the solution.");
	newConfigDoc.replaceItemValue("cfg_login_legal1","Copyright Declan F Lynch");
	newConfigDoc.replaceItemValue("cfg_login_legal2","IBM, the IBM logo and Lotus are trademarks of IBM Corporation, in the United States, other countries, or both.");
	// Sending EMail
	newConfigDoc.replaceItemValue("cfg_email_subject","fileSendr : ");
	newConfigDoc.replaceItemValue("cfg_email_direct","To access the file(s) that have been sent to you just click on the link below.");
	newConfigDoc.replaceItemValue("cfg_email_indirect","If the above link does not work then you can also access your files by visiting the site below and entering in the file access code.");
	newConfigDoc.replaceItemValue("cfg_email_footer","Sent using fileSendr, An OpenNTF project By Declan Lynch.");
	newConfigDoc.replaceItemValue("cfg_email_fromOverride","false");
	newConfigDoc.replaceItemValue("cfg_email_fromAddress","");
	// Receiving EMail
	newConfigDoc.replaceItemValue("cfg_email_receivesubject","fileSendr : ");
	newConfigDoc.replaceItemValue("cfg_email_receivedirect","To upload your files just click on the link below.");
	newConfigDoc.replaceItemValue("cfg_email_receiveindirect","If the above link does not work then you can also upload files by visiting the site below and entering in the upload authorization code.");
	newConfigDoc.replaceItemValue("cfg_email_receivefooter","Sent using fileSendr, An OpenNTF project By Declan Lynch.");
	// AWS
	newConfigDoc.replaceItemValue("cfg_AWS_AccessKey","-- PUT YOUR AWS ACCESS KEY HERE --");
	newConfigDoc.replaceItemValue("cfg_AWS_SecretKey","-- PUT YOUR AWS SECRET KEY HERE --");
	
	newConfigDoc.save(true,true);
}

function $A( object ){
		 // undefined/null -> empty array
		 if( typeof object === 'undefined' || object === null ){ return []; }

		 // Collections (Vector/ArrayList/etc) -> convert to Array
		 if( typeof object.toArray !== 'undefined' ){
		  return object.toArray();
		 }
		 
		 // Array -> return object unharmed
		 if( object.constructor === Array ){ return object; }
		 
		 // Return array with object as first item
		 return [ object ];
}