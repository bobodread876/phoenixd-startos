FROM acinq/phoenixd:0.6.3

USER root
ENV HOME="/root"

# Remove existing .phoenix directory and create symlink
RUN ln -s /phoenix/phoenix-cli /usr/local/bin/phoenix-cli
RUN rm -rf /phoenix/.phoenix && ln -s /root/.phoenix /phoenix/.phoenix
