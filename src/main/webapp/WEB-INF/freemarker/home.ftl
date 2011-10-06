<#import "spring.ftl" as spring />
<!DOCTYPE html>
<html class="Home <#if settings.debugMode>debug</#if>">
	<head>
		<#include "common/header.ftl" />
		<@header title="home.title" page="Home" />
	</head>
	<body onload="init('bigboard.page.Home')">
		
	</body>
</html>
