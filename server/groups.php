<?php
session_start();
require_once('storage.php');
$store = new Storage();

$action = $_GET['action'].'Groups';
if ( !method_exists($store, $action) ) { $store->reply(false,'Action unknown'); }
call_user_func( array($store, $action) );