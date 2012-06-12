<?php
class MongoHQ extends CI_Model {

	var $apiKey = '';
	var $dbURL = '';
	var $databaseName = '';
	var $collectionName = '';

	function __construct() {
		//calling the model constructor
		parent::__construct();
		$this->apiKey = "";
		$this->dbURL = "https://api.mongohq.com/databases/";
		$this->databaseName = "xcusemedb";
		$this->collectionName = "xcusemedata";
		/*
		Example URL : $ch = curl_init("https://api.mongohq.com/databases/xcusemedb/collections/xcusemedata/documents");
		*/
	}
	
	function mongoPOST($mongoArray, $request, $safe = false) {
		//FINAL WORKING CODE
		$data = array(
			"_apikey" => $this->apiKey,
			"document" => $mongoArray,
			"safe" => $safe //isafe If set to true, the operation waits until the document is saved before returning. Otherwise, the document gets saved asynchronously. This defaults to false.
		);
		$ch = curl_init($this->dbURL . $this->databaseName . "/collections/" . $this->collectionName . "/documents");
		curl_setopt($ch, CURLOPT_HTTPHEADER, array('Content-Type: application/json')); 
		curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
		curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "POST"); //used to have PUT
		curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));

		$response = curl_exec($ch);
		if(!$response) {
			return false;
		}

		$what = json_decode($response);
		return $what->_id;
	}
	
}
?>