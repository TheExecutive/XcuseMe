<script type="text/javascript">
	//######################################################################################
	// Author: ricocheting.com
	// Version: v2.0
	// Date: 2011-03-31
	// Description: displays the amount of time until the "dateFuture" entered below.
	
	// NOTE: the month entered must be one less than current month. ie; 0=January, 11=December
	// NOTE: the hour is in 24 hour format. 0=12am, 15=3pm etc
	// format: dateFuture1 = new Date(year,month-1,day,hour,min,sec)
	// example: dateFuture1 = new Date(2003,03,26,14,15,00) = April 26, 2003 - 2:15:00 pm
	
	dateFuture1 = new Date(2012,6,27,16,0,00);
	
	// TESTING: comment out the line below to print out the "dateFuture" for testing purposes
	//document.write(dateFuture +"<br />");
	
	
	//###################################
	//nothing beyond this point
	function GetCount(ddate,iid){
	
		dateNow = new Date();	//grab current date
		amount = ddate.getTime() - dateNow.getTime();	//calc milliseconds between dates
		delete dateNow;
	
		// if time is already past
		if(amount < 0){
			document.getElementById(iid).innerHTML="Now!";
		}
		// else date is still good
		else{
			years=0;weeks=0;days=0;hours=0;mins=0;secs=0;out="";
	
			amount = Math.floor(amount/1000);//kill the "milliseconds" so just secs
	
			years=Math.floor(amount/31536000);//years (no leapyear support)
			amount=amount%31536000;
	
			weeks=Math.floor(amount/604800);//weeks
			amount=amount%604800;
	
			days=Math.floor(amount/86400);//days
			amount=amount%86400;
	
			hours=Math.floor(amount/3600);//hours
			amount=amount%3600;
	
			mins=Math.floor(amount/60);//minutes
			amount=amount%60;
	
			secs=Math.floor(amount);//seconds
	
			if(years != 0){out += (years<=9?'0':'')+years +" "+((years==1)?"year":"years")+", ";}
			if(weeks != 0){out += (weeks<=9?'0':'')+weeks +" "+((weeks==1)?"week":"weeks")+", ";}
			if(days != 0){out += (days<=9?'0':'')+days +" "+((days==1)?"day":"days")+", ";}
			if(hours != 0){out += (hours<=9?'0':'')+hours +" "+((hours==1)?"hour":"hours")+", ";}
			if(mins != 0){out += (mins<=9?'0':'')+mins +" "+((mins==1)?"min":"mins")+", ";}
			if(secs != 0){out += (secs<=9?'0':'')+secs +" "+((secs==1)?"sec":"secs")+", ";}
			out = out.substr(0,out.length-2);
			document.getElementById(iid).innerHTML=out;
	
			setTimeout(function(){GetCount(ddate,iid)}, 1000);
		}
	}

	window.onload=function(){
		GetCount(dateFuture1, 'countDownDiv');
		//you can add additional countdowns here (just make sure you create dateFuture2 and countbox2 etc for each)
	};
</script>
