require 'bundler/setup'
require 'sinatra'
require 'json'

# run index.html upon page load
get '/' do
  File.read('views/index.html')
end

# load JSON of favorites
get '/favorites' do
  response.header['Content-Type'] = 'application/json'
  File.read('data.json')
end

# add new file
post '/favorites' do
  # file = JSON.parse(File.read('data.json'))
  unless params[:name] && params[:oid]
    return 'Invalid Request'
  end
  movie = { name: params[:name], oid: params[:oid] }
  # file << movie
  File.write('data.json', JSON.pretty_generate(movie))
end
