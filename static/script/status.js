
dStatus = async () => {
  try {
    const response = await fetch(
      `https://api.github.com/repos/KaywonKUMA/kaywonkuma.github.io/actions/runs?per_page=1`,
      { cache: "no-store" }
    );

    if (!response.ok) {
      throw new Error("GitHub API request failed");
    }
    
    const { workflow_runs  } = await response.json();
    
    const { status, head_commit, head_sha, run_started_at, created_at, updated_at, started_at, html_url } = workflow_runs[0];

    if (!workflow_runs[0]) return;
    
    const commitUrl = `https://github.com/KaywonKUMA/kaywonkuma.github.io/commit/${head_sha}`;
    const { committer, message, timestamp } = head_commit;
    

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
    
    console.log("[ BUILD STATUS ]");

    console.log(`Started   : ${formatDate(run_started_at || created_at)}`);

    if (status === "completed") {
      console.log(`Completed : ${formatDate(updated_at)}`);

      const duration = Math.floor(
        (new Date(updated_at) - new Date(run_started_at)) / 1000
      );
          console.log(`Duration  : ${duration}s`);
      } else {
          console.log("Completed : Not yet completed");
      }
      console.log(`Status    : ${status}`);
      console.log(`Workflow  : ${html_url}`);
  } catch (error) {
    console.error("[ DEPLOYMENT ERROR ]", error);
  }
};



dStatus();
