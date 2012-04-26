<?php
  //checking if the contact form has been submitted
  if(isset($_POST['submit']))
   {
     //storing form data into variables
     $UMessage = $_POST['UMessage'];
     $URecommend = $_POST['URecommend'];
     $UExperience = $_POST['UExperience'];
     $To = "reddoggato@gmail.com";

     //validating data (checking all fields have been filled in)
     if($UMessage == "" OR $URecommend == "" OR $UExperience == "")
     {
        $error = "Please fill all fields to send a message";
     }
     else
     {
        //send email to admin
        $subject = " XCuseme - Mobile Application Contact Us!";
        $headers .= "MIME-Version: 1.0 ";
        $headers .= "Content-Type: text/html; charset=ISO-8859-1 ";
     
        //formatting message
        $message = "";
        $message .= "<h1>Contact Us Message! </h1><br />
                            <strong>User Message: </strong>" . $UMessage . "<br />
                            <strong>Would the user recommend this app ?: </strong>" . $URecommend . "<br />
                            <strong>Experience Rating ?: </strong>" . $UExperience . "." ;
        $message .= "</body></html>";
   
        //checking if the email has been sent
        if ( mail($To,$subject,$message,$headers) )
        {
             echo "Email successfully sent";
        }
        else
        {
             echo "Could not send email";
        }
    }
 }
?>