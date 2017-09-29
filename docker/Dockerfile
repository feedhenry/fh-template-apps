FROM rhel7/rhel

LABEL org.feedhenry.fh-template-apps-version="5.0.13" \
      org.feedhenry.fh-template-apps-build-number="747"

COPY ["container-entrypoint", "fh-template-apps-*.tar.gz", "/"],

RUN yum install -y --setopt=tsflags=nodocs --disablerepo=* --enablerepo=rhel-7-server-rpms tar && \
    yum clean all && \
    chmod a+rx /container-entrypoint && \
    chmod a+rx /fh-*.tar.gz

USER 1001

ENTRYPOINT ["/container-entrypoint"]
