import discord
import json
import argparse

# create a Discord client
client = discord.Client()

# create a command parser
parser = argparse.ArgumentParser()
parser.add_argument('player', choices=['player1', 'player2', 'player3', 'player4'])
parser.add_argument('score', choices=['score1', 'score2', 'score3', 'score4'])
parser.add_argument('amount', type=int)

# create commands for the bot
@client.command()
async def update_score(ctx, args):
    # parse the arguments
    args = parser.parse_args(args.split())

    # load the players and their scores from the JSON file
    with open('players.json', 'r') as f:
        players = json.load(f)

    # find the player and update the appropriate score
    player = players[args.player]
    player[args.score] += args.amount

    # save the updated players and scores to the JSON file
    with open('players.json', 'w') as f:
        json.dump(players, f)

    # send a message to confirm the update
    await ctx.send(f'{args.player}'s {args.score} has been updated by {args.amount}')

# run the bot
client.run('YOUR_BOT_TOKEN_HERE')