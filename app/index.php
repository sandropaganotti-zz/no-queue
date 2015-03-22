<?php

/* -- Required table structure --
CREATE TABLE `queues` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `registration_id` text NOT NULL,
  `endpoint` text NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8
*/

header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");

$mysqli = new mysqli( null, 'root', '', 'no_queue', null, '/cloudsql/shaped-apogee-87811:app-queues' );
$path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$method = $_SERVER['REQUEST_METHOD'];
$params = array();
$body = json_decode(file_get_contents('php://input'), true);
$domain = 'https://' . $_SERVER['SERVER_NAME']; 

/* GET /queue/:name?user_id=:user_id */
if(preg_match("/^\/queue\/([^\/]+)$/", $path, $params) && $method == 'GET') {
	
	$name = $mysqli->real_escape_string($params[1]);
   	$user_id = array_key_exists('user_id', $_GET) ? $mysqli->real_escape_string($_GET['user_id']) : null;
	$query = 'SELECT count(*) as size FROM queues WHERE name = "' . $name . '"';
	$result = $mysqli->query($query);
	$row = $result->fetch_assoc();
	$size = $row['size'];
  	$position = null;
		
	if($user_id){
		$result = $mysqli->query($query . ' AND id <= ' . $user_id );
		$row = $result->fetch_assoc();
		$position = $row['size'];
	}

	echo json_encode(array(
   		'name' => $params[1],
      	'size' => $size,
		'position' => $position,
		'actions' => array(
			'subscribe' => $domain . $path,
			'manage' => $domain . $path . '/manage'
    	)
	));
}

/* POST /queue/:name */
elseif(preg_match("/^\/queue\/([^\/]+)$/", $path, $params) && $method == 'POST') {

	$name = $mysqli->real_escape_string($params[1]);
	$registration_id = $mysqli->real_escape_string($body['registration_id']);
	$endpoint = $mysqli->real_escape_string($body['endpoint']);
	
	$result = $mysqli->query('INSERT INTO queues (name, registration_id, endpoint) VALUES ("'.$name.'","'.$registration_id.'","'.$endpoint.'")');
	$created = $result != false;	

	echo json_encode(array(
		'created' => $created,
 		'user_id' => $created ? $mysqli->insert_id : null
	));

}

/* GET /queue/:name/manage */
elseif(preg_match("/^\/queue\/([^\/]+)\/manage$/", $path, $params) && $method == 'GET') { 

	$name = $mysqli->real_escape_string($params[1]);
	$result = $mysqli->query('SELECT * FROM queues WHERE name = "' . $name . '" LIMIT 1');
  	$row = $result->fetch_assoc();
	$current = $row['id'];
	$registration_id = $row['registration_id'];
	$endpoint = $row['endpoint'];

	if($registration_id && $endpoint && getenv('api_key')) {
		$context = [
		  'http' => [
		    'method'	=> 	'POST',
		    'header'	=> 	"Authorization: key=" . getenv('api_key') . "\r\n" .
							"Content-Type: application/json\r\n",
		    'content'	=> 	json_encode(array('registration_ids' => array( $registration_id )))
		  ]
		];
		$context = stream_context_create($context);
		$result = file_get_contents($endpoint, false, $context);
	}

	echo json_encode(array(
		'current' => $current,
		'push_result' => $result,
		'auth' => getenv('api_key'),
		'actions' => array(
			'next' => $domain . $path,
			'manage' => $domain . $path
		) 
   ));
}

/* POST /queue/:name/manage */
elseif(preg_match("/^\/queue\/([^\/]+)\/manage$/", $path, $params) && $method == 'POST') {
  
	$name = $mysqli->real_escape_string($params[1]);
	$result = $mysqli->query('DELETE FROM queues WHERE name = "' . $name . '" LIMIT 1');
	$deleted = $result != false;
  
  	echo json_encode(array(
   	'deleted' => $deleted
   ));
  
}
?>