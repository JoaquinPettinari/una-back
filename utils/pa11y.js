function countIssuesByType(issues) {
  const count = {
    error: 0,
    warning: 0,
    notice: 0,
  };
  issues.forEach((issue) => {
    count[issue.type]++;
  });
  return count;
}

function isAccessible(issues) {
  const uniqueCodes = new Set(issues.map((issue) => issue.code));
  return {
    accessible: uniqueCodes.size <= 8,
    countAprovedIssues: 38 - uniqueCodes.size,
  };
}

const defaultErrorResponse = (textError, url) => {
  return {
    data: { documentTitle: "", pageUrl: url, issues: [] },
    ok: false,
    issueCountByType: { error: 0, warning: 0, notice: 0 },
    accessible: false,
    countAprovedIssues: 0,
    error: textError,
  };
};

const successResponse = (pa11yResponse, url) => {
  const issues = pa11yResponse.issues;
  const issueCountByType = countIssuesByType(issues);
  const errorIssues = issues.filter((issue) => issue.typeCode === 1);
  const { countAprovedIssues, accessible } = isAccessible(errorIssues);

  return {
    data: { ...pa11yResponse, pageUrl: url },
    ok: true,
    issueCountByType,
    accessible,
    countAprovedIssues,
  };
};

const errorResponse = (error, url) => {
  console.log(error);
  if (error.name === "TimeoutError") {
    return {
      ...defaultErrorResponse(
        "El análisis de la página ha tardado demasiado tiempo. Por favor, intente mas tarde.",
        url
      ),
    };
  } else if (error.name === "TypeError") {
    return {
      ...defaultErrorResponse(
        `Error al parsear la URL ${url}, pruebe escribiendo http:// adelante`,
        url
      ),
    };
  } else {
    return {
      ...defaultErrorResponse(
        "Error durante el análisis de la página. Por favor, intente mas tarde",
        url
      ),
    };
  }
};

export { successResponse, errorResponse };
