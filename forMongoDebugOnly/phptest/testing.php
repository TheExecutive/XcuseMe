<?php
	//This block of code fixes my errors not showing up
	//ini_set('display_errors', '1');
	//error_reporting(E_ALL);

	$apiKey = "xvien5ya8rh538ryt5kh";

//FINAL WORKING CODE
  $data = array("_apikey" => $apiKey, "document" => array("testing"=>true, "number"=>2, "string"=>"testing string"));
  $ch = curl_init("https://api.mongohq.com/databases/xcusemedb/collections/xcusemedata/documents");
  curl_setopt($ch, CURLOPT_HTTPHEADER, array('Content-Type: application/json')); 
  curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
  curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "POST"); //used to have PUT
  curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
 
        $response = curl_exec($ch);
        if(!$response) {
            return false;
        }
        
        $what = json_decode($response);
        echo $what->_id;
?>