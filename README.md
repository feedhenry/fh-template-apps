template-config
===============

Repo for configuration of project, app, form, theme and connector templates.

### global.json

Contains all project, app and connector template configs.

### global-forms.json

Contains all form and theme template configs.

### About icon classes

fh-ngui still uses the old version of font-awsome so the icon classes need to be compatible with fontawsome v3.2. 
The docs of this version is [here](http://fortawesome.github.io/Font-Awesome/3.2.1/icons/).

### Archive Templates

To create an archive of all configured templates

```
grunt archive
```

### Format Templates

Format all .json template config files (You should run this after you update anything and before you check it in)

```
grunt format
```





