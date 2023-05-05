[ReChecked Viewer](https://view.rechecked.io) - ReChecked Agent viewing utility.

You can use the viewer to easily access information about your rcagents such as:
- Graphical views of usage stats
- Examples of how to build active (check_rcagent.py) and passive checks
- Explore the status API using the API Viewer
- Run plugins and view output and example checks

Agent information used on the hosted site is only available in your browser and not stored on ReChecked servers.

If you want to use your own hosted version locally or internally, you can build it by cloning the repo and using:
```
npm ci
npm build
```

You can then serve the `build` directory however you choose, such as with nginx or apache.