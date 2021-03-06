const lt = require('../');

// Construct a session. Hold on to this.
const session = new lt.session();

function alertHandler(err, result) {
    if (result) {
        const alerts = session.pop_alerts();

        for (const alert of alerts) {
            console.log(alert);
        }
    }

    session.wait_for_alert(500, alertHandler);
}

session.wait_for_alert(500, alertHandler);

// The torrent_handle representing our
// added torrent.
const handle = session.add_torrent({
    save_path: "C:\\tmp",
    ti: new lt.torrent_info(process.argv[2])
});

function update() {
    const status = handle.status();

    if (status.errc) {
        console.error(status.errc.message);
        return;
    }

    console.log('%s [%s]: rate: %d, state: %s, progress: %d',
        status.name,
        status.info_hash,
        status.download_rate,
        status.state,
        status.progress);

    if (status.progress >= 1) {
        console.log('finished');
    } else {
        setTimeout(update, 1000);
    }
}

update();
