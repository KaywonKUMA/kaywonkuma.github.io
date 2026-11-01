
dStatus = async () => {
  try {
    const response = await fetch(
      `https://api.github.com/repos/KaywonKUMA/kaywonkuma.github.io/actions/runs?per_page=1`,
      { cache: "no-store" }
    );

    if (!response.ok) {
      throw new Error("GitHub API request failed");
    }

    const { workflow_runs } = await response.json();
    const run = workflow_runs[0];

    if (!run) return;

    const commitUrl = `https://github.com/KaywonKUMA/kaywonkuma.github.io/commit/${run.head_sha}`;
    const { committer, message, timestamp } = run.head_commit;

    const formatDate = (date) =>
      new Date(date).toLocaleString("ko-KR", {
        year: "2-digit",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
        timeZone: "Asia/Seoul"
      });

    console.log("[ DEPLOYMENT ]");

    console.log(`Commit    : ${message}`);
    console.log(`Author    : ${committer.name}`);
    console.log(`Timestamp : ${formatDate(timestamp)}`);
    console.log(commitUrl);
    console.log()
    
    console.log("[ BUILD STATUS ]");

    console.log(`Started   : ${formatDate(run.run_started_at || run.created_at)}`);

    if (run.status === "completed") {
      console.log(`Completed : ${formatDate(run.updated_at)}`);

      const duration = Math.floor(
        (new Date(run.updated_at) - new Date(run.run_started_at)) / 1000
      );

      console.log(`Duration  : ${duration}s`);
    } else {
      console.log("Completed : Not yet completed");
    }

    let status;

    if (run.status === "queued") {
      status = "BUILD QUEUED";
    } else if (run.status === "in_progress") {
      status = "BUILD IN PROGRESS";
    } else if (run.conclusion === "success") {
      status = "BUILD SUCCESS";
    } else if (run.conclusion === "failure") {
      status = "BUILD FAILED";
    } else if (run.conclusion === "cancelled") {
      status = "BUILD CANCELLED";
    } else {
      status = "UNKNOWN";
    }

    console.log(`Status    : ${status}`);
    console.log(`Workflow  : ${run.html_url}`);

  } catch (error) {
    console.error("[ DEPLOYMENT ERROR ]", error);
  }
  
};



dStatus();
