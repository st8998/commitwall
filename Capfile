
load 'deploy'

set :node_env, 'production'
set :branch, 'master'
set :application_port, '3001'

set :application, 'commitwall'
set :node_file, 'app.js'
set :host, '188.226.255.234'

set :repository, 'git@github.com:st8998/commitwall.git'

ssh_options[:keys] = [File.join(ENV['HOME'], '.ssh', 'id_rsa')]
ssh_options[:forward_agent] = true

set :user, 'deploy'
set :admin_runner, 'deploy'

set :scm, :git
set :deploy_via, :remote_cache
role :app, host
set :deploy_to, "/var/www/#{application}"
set :use_sudo, true

set :normalize_asset_timestamps, false

namespace :deploy do

  task :start, :roles => :app, :except => {:no_release => true} do
    run "sudo start #{application}"
  end

  task :stop, :roles => :app, :except => {:no_release => true} do
    run "sudo stop #{application}"
  end

  task :restart, :roles => :app, :except => {:no_release => true} do
    run "sudo restart #{application} || sudo start #{application}"
  end

  desc "Symlink lib files"
  task :symlink_libs, :roles => :app do
    run "mkdir -p #{shared_path}/node_modules"
    run "ln -s #{shared_path}/node_modules #{release_path}/node_modules"
  end

  desc "Install dependency libs"
  task :check_packages, :roles => :app do
    run "cd #{release_path} && npm install -d"
  end

  task :create_deploy_to_with_sudo, :roles => :app do
    run "sudo mkdir -p #{deploy_to}"
    run "sudo chown #{admin_runner}:#{admin_runner} #{deploy_to}"
  end

  task :write_upstart_script, :roles => :app do
    upstart_script = <<-UPSTART
      description "#{application}"

      start on startup
      stop on shutdown

      script
          # We found $HOME is needed. Without it, we ran into problems
          export HOME="/home/#{admin_runner}"
          export NODE_ENV="#{node_env}"

          cd #{current_path}
          exec sudo -u #{admin_runner} sh -c "NODE_ENV=#{node_env} PORT=#{application_port} /usr/local/bin/node #{current_path}/#{node_file} >> #{shared_path}/log/#{node_env}.log 2>&1"
      end script
      respawn
    UPSTART
    put upstart_script, "/tmp/#{application}_upstart.conf"
    run "sudo mv /tmp/#{application}_upstart.conf /etc/init/#{application}.conf"
  end

end

before 'deploy:setup', 'deploy:create_deploy_to_with_sudo'
after 'deploy:setup', 'deploy:write_upstart_script'
after 'deploy:finalize_update', 'deploy:symlink_libs', 'deploy:check_packages', 'deploy:cleanup'
