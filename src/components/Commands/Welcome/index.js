import React from 'react';

import './style.scss';

const Welcome = (props) => {
  return (
    <div className="Welcome">
      <pre>{`
Welcome to Ynkr 0.0.1

* For available commands, run 'compgen'
* For my resume, run 'man ynkr'

System information as of ${new Date()}

System load:  1.61803399%        Processes:           72
Usage of /:   92% of 23.93GB     Users logged in:     42
Memory usage: 9%                 IP address for eth0: 1.23.58.13
Swap usage:   0%

By the way, all of this is total hogwash, but it keeps with the
theme. Also, the line below? Totally inaccurate. I have no idea
who you are or when you last logged in...or do I? Mwa-ha-ha-ha!

Last login: Tue Jul 2 06:15:00 1974 from 86.75.30.9`}
      </pre>
    </div>
  );
};
export default Welcome;
