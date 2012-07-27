<%@ tag language="java" pageEncoding="UTF-8"%>
<%@ attribute name="style" required="false" %>
<jsp:doBody var="innerContent" />
<style type="text/css">
<%@ include file="/WEB-INF/uif/css/wrappers.css" %>
</style>
<script type="text/javascript">
<%@ include file="/WEB-INF/uif/js/uif.js" %>
</script>
<body style="${style}" onload="uif.init();">
${innerContent}
</body>
