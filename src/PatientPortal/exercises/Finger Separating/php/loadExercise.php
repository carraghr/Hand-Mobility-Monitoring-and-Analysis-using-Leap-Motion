<?php
    session_start();

    if(!isset($_SESSION['user_id'])){
        require('../../../../assets/php/redirect.php');
        redirectUser('../../../../index.php');
    }

    $PageTitle = 'Finger Separating Exercise';
    $SelectedHand = $_COOKIE["SelectedHand"];
    $Exercise = str_replace("%20", " ",$_COOKIE["SelectedExercise"]);
    $ID = $_SESSION['user_id'];

    include_once('../../Common/php/handExerciseInformation.php');

    include('../../Common/html/header.html');

    echo "<script type='text/javascript'>";
    echo "var targets = ".json_encode($results).";\n\r";
    echo "var repsToDo = ". $reps.";\n\r";
    echo "var seqsToDo = ". $seq.";\n\r";
    echo "var selectedHand = '".$SelectedHand."';\n\r";
    echo "</script>";

    include('../html/instructions.html');
    include('../../Common/html/gameStage.html');
    include('../html/resourcesToLoad.html');
    include('../../Common/html/footer.html');
