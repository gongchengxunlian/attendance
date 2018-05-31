
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<html>
<head>
    <title>信息列表</title>
</head>
<body>
    <c:if test="${!empty list}">
        <c:forEach var="user" items="${list}">
            信息：${user.purview_name}  &nbsp;&nbsp;<br>
        </c:forEach>
    </c:if>
</body>
</html>
