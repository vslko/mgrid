<?php
class Storage {

	private $intial_data = array(
		'cities' => array(
			'1' => array('city'=>'Abuja',	'country'=>'Nigeria',	'value'=>"122", 'groups'=>'1' ),
			'2' => array('city'=>'Nairobi',	'country'=>'Kenya',		'value'=>"133", 'groups'=>'1' ),
			'3' => array('city'=>'Lima',	'country'=>'Pery',		'value'=>"211", 'groups'=>'2' ),
			'4' => array('city'=>'Caracas',	'country'=>'Venezuela',	'value'=>"233", 'groups'=>'2' ),
			'5' => array('city'=>'Madrid',	'country'=>'Spain',		'value'=>"311", 'groups'=>'3' ),
			'6' => array('city'=>'Berlin',	'country'=>'German',	'value'=>"322", 'groups'=>'3' ),
			'7' => array('city'=>'Tokio',	'country'=>'Japan',		'value'=>"411", 'groups'=>'4' ),
			'8' => array('city'=>'Karachi',	'country'=>'Pakistan',	'value'=>"422", 'groups'=>'4' ),
			'9' => array('city'=>'Sydnei',	'country'=>'Australia',	'value'=>"70", 'groups'=>'' ),
			'10' => array('city'=>'Merauke','country'=>'Papua',		'value'=>"71", 'groups'=>'' ),
		),
		'regions' => array(
			'1' => array('name'	=> 'Africa'),
			'2' => array('name'	=> 'Amerika'),
			'3' => array('name'	=> 'Europa'),
			'4' => array('name' => 'Asia')
		)
	);


	public function __construct() {		 unset($_SESSION['mgrid_items']); unset($_SESSION['mgrid_groups']);
		$this->ITEMS 	= $_SESSION['mgrid_items'] ? $_SESSION['mgrid_items'] : $this->intial_data['cities'];
		$this->GROUPS 	= $_SESSION['mgrid_groups'] ? $_SESSION['mgrid_groups'] : $this->intial_data['regions'];
	}






    // ============================
    // ===== HELPER FUNCTIONS =====
    // ============================
	private function store() {		 $_SESSION['mgrid_items'] = $this->ITEMS;
		 $_SESSION['mgrid_groups'] = $this->GROUPS;	}


	private function getParameters() {
		return array(
            			 '_page'  => $_GET['_page'] ? (int)$_GET['_page'] : 1,		// page number
		            	 '_recs'  => $_GET['_recs'] ? (int)$_GET['_recs'] : 10,		// records on page
		            	 '_scol'  => $_GET['_scol'] ? $_GET['_scol'] : null,      	// sorting column
		            	 '_sord'  => $_GET['_sord'] ? $_GET['_sord'] : 'asc',		// sorting order
		            	 '_group' => $_GET['_group'] ? $_GET['_group'] : 0          // group id
        );
    }


    public function reply( $success=true, $message='', $data = array() ) {
        header('Cache-Control: no-cache, must-revalidate');
        header('Expires: Sun, 01 Jan 2001 01:01:01 GMT');
        header('Content-type: application/json');
        print( json_encode( array('success'=>$success, 'message'=>$message, 'data'=>$data ) ) );
        exit;
    }




    // =========================
    // ===== ITEMS ACTIONS =====
    // =========================
	public function fetchItems() {    	$params = $this->getParameters();
    	$data = array(
    		'page'	=> $params['_page'],
    		'total'	=> 0,
    		'items'	=> array()
    	);
    	$min = ($params['_page']-1) * $params['_recs'];
    	$max = $min + $params['_recs'];

    	$i = -1;
    	foreach($this->ITEMS as $id => $item) {        	$i++;
	    	if ( $params['_group']=="all" || ($params['_group']=='not' && $item['groups']=='') || (strpos(':'.$item['groups'].':', ':'.$params['_group'].':') !== false) ) { // filter by group		    	$data['total']++;
		    	if ($i >= $min && $i < $max) { // filter by page
    				$data['items'][] = array(
    					'id'	=> $id,
    					'city'	=> $item['city'],
    					'country'	=> $item['country'],
    					'value'	=> $item['value'],
    					'_groups' => strlen($item['groups']>0) ? explode(':',$item['groups']) : array()
    				);
    			}
    		}
    	}
    	$this->reply(true,'ok',$data);	}


    public function addItems() {	    $id	  	= rand(10000,99999);
	    $fields = array(
	    	'city'	  => $_POST['city'],
	    	'country' => $_POST['country'],
	    	'value'	  => $_POST['value'],
	    	'groups'  => (int)$_POST['_group']
	    );
	    $this->ITEMS[$id] = $fields;
	    $this->store();

	    $fields['id'] = $id;
	    $fields['_groups'] = $fields['groups'] ? explode(":",$fields['groups']) : array();
	    unset($fields['groups']);

	    $this->reply( true, 'City added', $fields );
    }


    public function updateItems() {
	    $id	= $_POST['id'];
	    $this->ITEMS[$id]['city'] = $_POST['city'];
		$this->ITEMS[$id]['country'] = $_POST['country'];
		$this->ITEMS[$id]['value'] = $_POST['value'];
	    $this->store();

	    $fields = $this->ITEMS[$id];
	    $fields['id'] = $id;
	    $fields['_groups'] = $fields['groups'] ? explode(":",$fields['groups']) : array();
	    unset($fields['groups']);

	    $this->reply( true, 'City updated', $fields );
    }


    public function removeItems() {    	$id = $_POST['id'];
    	unset($this->ITEMS[$id]);
    	$this->store();
        $this->reply( true, 'City removed', $id );
    }


    public function moveItems() {		$id 	= (int)$_POST['item_id'];
		$src	= $_POST['src_id'];
		$dst	= $_POST['dst_id'];

		if ( ($src=='all') || ($dst=='all') ) { $this->reply(false, 'Can\'t move into/from All group'); }

        if ($dst == 'not') {  // from [any] group to [not] group
        	$outGroups = $this->ITEMS[$id]['groups'] ? explode(":",$this->ITEMS[$id]['groups']) : array();
        	$this->ITEMS[$id]['groups'] = ''; // remove all groups in item
        }
        else if ( $src == 'not' ) {  // from [not] group to [any] group
            $outGroups = array('not');
            $this->ITEMS[$id]['groups'] = $dst; // add destination group into item
  		}
        else {  // from [any] group to other [any] group
        	$outGroups = array( $src );
         	$groups = explode(":",$this->ITEMS[$id]['groups']);
         	// remove source group from groups list
         	$index = array_search($src, $groups);
			if ($index !== false) { unset( $groups[$index] ); }
         	// add new group into list for item
            $groups[] = $dst;
            $this->ITEMS[$id]['groups'] = implode(":",$groups);
        }

        $this->store();

	    $this->reply(
	     	true,
	     	'City moved',
	        array( 'item_id' 	=> $id,
	        	   'dst_id' 	=> $dst,
	        	   'out_groups' => $outGroups
			)
		);
    }


	public function copyItems() {
		$id		= (int)$_POST['item_id'];
		$src	= $_POST['src_id'];
		$dst	= $_POST['dst_id'];

		if ($dst == 'all') { $this->reply(false, 'Not define destination group' ); }

		if ($dst == 'not') {  // copy from [any|all] group to [not] group == move to [not] group
        	$outGroups = $this->ITEMS[$id]['groups'] ? explode(":",$this->ITEMS[$id]['groups']) : array();
        	$this->ITEMS[$id]['groups'] = ''; // remove all groups in item
		}
		else if ( empty( $this->ITEMS[$id]['groups'] ) ) { // copy from [not] group to [any] group == move from [not] group
            $outGroups = array('not');
            $this->ITEMS[$id]['groups'] = $dst;
 		}
        else { // copy from [any] to [any] group
        	$outGroups = array();
        	$this->ITEMS[$id]['groups'] = $this->ITEMS[$id]['groups'].":".$dst;
        }

        $this->store();

	    $this->reply(
	     	true,
	     	'City copied',
	        array( 'item_id' 	=> $id,
	        	   'dst_id' 	=> $dst,
	        	   'out_groups' => $outGroups
			)
        );

    }







    // ==========================
    // ===== GROUPS ACTIONS =====
    // ==========================
	public function fetchGroups() {    	$data = array(
    		'total'		=> count($this->ITEMS),
    		'without'	=> 0,
    		'groups'	=> array()
    	);

    	foreach($this->GROUPS as $id => $group) {    		$items = 0;
    		foreach($this->ITEMS as $item_id => $item) {    			if ( strpos(':'.$item['groups'].":", ":".$id.":" ) !== false ) { $items++; }    		}
    		$data['groups'][] = array(
    			'id'	=> $id,
    			'name'	=> $group['name'],
    			'items'	=> $items
    		);
    	}
		foreach($this->ITEMS as $item_id => $item) {			$data['without'] = $data['without'] + ( $item['groups'] ? 0 : 1);
		}

    	$this->reply(true,'ok',$data);
	}


    public function addGroups() {		$id	  	= rand(10000,99999);
	    $fields = array(
	    	'name'	  => $_POST['name'],
	    );
	    $this->GROUPS[$id] = $fields;
	    $this->store();

	    $fields['id'] = $id;
	    $fields['items'] = "0";
	    $this->reply( true, 'Region added', $fields );
	}


    public function updateGroups() {    	$id		= $_POST['id'];
		$fields = array(
			'name'	  => $_POST['name'],
		);
		$this->GROUPS[$id] = $fields;
		$this->store();
		$fields['id'] = $id;

		$this->reply( true, 'Region updated', $fields );
    }


	public function removeGroups() {    	$id		= $_POST['id'];
        $without = 0;
        foreach($this->ITEMS as $item_id => $item) {        	$groups = $item['groups'] ? explode(":",$item['groups']) : array();
         	$index = array_search($id, $groups);
			if ($index !== false) { unset( $groups[$index] ); }        	$this->ITEMS[$item_id]['groups'] = implode(":",$groups);
        	if (count($groups) == 0) { $without++; }
        }
    	unset($this->GROUPS[$id]);
    	$this->store();

    	$this->reply( true, 'Region removed', array('id'=>$id, 'without'=>$without) );
	}

	public function clearGroups() {
    	$id		= $_POST['id'];
        $without = 0;
        foreach($this->ITEMS as $item_id => $item) {
        	$groups = $item['groups'] ? explode(":",$item['groups']) : array();
         	$index = array_search($id, $groups);
			if ($index !== false) { unset( $groups[$index] ); }
        	$this->ITEMS[$item_id]['groups'] = implode(":",$groups);
        	if (count($groups) == 0) { $without++; }
        }
    	$this->store();

    	$this->reply( true, 'Region cleared', array('id'=>$id, 'without'=>$without) );
	}

}