<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Main extends CI_Controller {

	public function __construct() {
		//any constructor must contain this
		parent::__construct();
		
		//The Database Library and Session Library are loaded by default. Otherwise I'd need to load them here.
		//$this->load->library('session');
		//loading message helper
		//$this->load->library('message');
		
		//form helper, and url helper
		$this->load->helper(array('form', 'url', 'html'));
		
		//models
		$this->load->model('Testing');
    }
	public function index()
	{
		//check to see if they're already logged in. If so, this will redirect
		$this->checkLoggedInIndex();
		//$this->Testing->setup("gkhgkhjgkhjgk");
		$data = $this->Testing->getAllUsers();
		var_dump($data);
	}
	public function fourohfour()
	{
		//this function determines what is displayed for a 404 page.
	}
	private function checkLoggedInIndex(){
		$is_logged_in = $this->session->userdata('is_logged_in');
		
		if(isset($is_logged_in) && $is_logged_in == true){
			//if they're logged in, get them off of the landing page
			//redirect('site/index');
		};
		
	}
}

/* End of file main_controller.php */
/* Location: ./application/controllers/main_controller.php */