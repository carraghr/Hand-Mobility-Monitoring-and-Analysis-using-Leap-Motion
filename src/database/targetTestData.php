<?php

require ('../databaseConnection.php');

$query = "insert into Targets
        values ('1232890','Finger Separating','right','index','8','2','3')";
$queryResult = @mysqli_query($databaseConnection, $query) OR trigger_error($databaseConnection->error."[ $query]");

$query = "insert into Targets
            values ('1232890','Finger Separating','right','middle','8','2','3')";
$queryResult = @mysqli_query($databaseConnection, $query) OR trigger_error($databaseConnection->error."[ $query]");

$query = "insert into Targets
            values ('1232890','Finger Separating','right','thumb','9','2','3')";
$queryResult = @mysqli_query($databaseConnection, $query) OR trigger_error($databaseConnection->error."[ $query]");

$query = "insert into Targets
            values ('1232890','Finger Separating','right','ring','8','2','3')";
$queryResult = @mysqli_query($databaseConnection, $query) OR trigger_error($databaseConnection->error."[ $query]");

$query = "insert into Targets
            values ('1232890','Finger Separating','left','index','8','2','3')";
$queryResult = @mysqli_query($databaseConnection, $query) OR trigger_error($databaseConnection->error."[ $query]");

$query = "insert into Targets
                values ('1232890','Finger Separating','left','middle','8','2','3')";
$queryResult = @mysqli_query($databaseConnection, $query) OR trigger_error($databaseConnection->error."[ $query]");

$query = "insert into Targets
                values ('1232890','Finger Separating','left','thumb','9','2','3')";
$queryResult = @mysqli_query($databaseConnection, $query) OR trigger_error($databaseConnection->error."[ $query]");