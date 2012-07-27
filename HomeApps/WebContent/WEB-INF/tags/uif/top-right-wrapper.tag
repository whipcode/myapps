<%@ tag language="java" pageEncoding="UTF-8"%>
<%@ attribute name="id" required="true" %>
<%@ attribute name="style" required="true" %>
<jsp:doBody var="innerContent" />
<div id="${id}" class="top-right-wrapper" style="${style}">
${innerContent}
<script type="text/javascript">uif.addFixedWrapper("${id}");</script>
</div>
