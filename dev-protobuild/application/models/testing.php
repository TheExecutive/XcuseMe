<?php
class Testing extends CI_Model {

	var $type = '';

	function __construct() {
		//calling the model constructor
		parent::__construct();
		$this->load->library('image_lib');//loading image manip in the constructor
		$this->load->model('MongoHQ');

		$this->type = isset($type) ? $type : "mysql";
	}
	
	function setup($setupType) {
		//tested and working
		$this->type = $setupType;
	}

	function getAllUsers() {
		//tested and working
		$query = $this->db->get('users');
		//return $query->result();
		$mongoArray = array(
			"testing" => true,
			"number" => 2,
			"string" => "tWHOAT"
		);
		//mongoDBHQ($mongoObj, $request)
		$this->MongoHQ->mongoPOST($mongoArray, "POST");
		return $this->type;
	}
	
	function getUserById($userId) {
		//tested and working
		$query = $this->db->get_where('users', array('userId' => $userId));
    	return $query->row();
		//return $query->row_array();
	}
	
	function getUserByUsername($username) {
		//tested and working
		$query = $this->db->get_where('users', array('username' => $username));
		return $query->row();
	}
	
}
?>