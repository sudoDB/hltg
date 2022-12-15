# IMPORTS
import json
import discord
from discord.ext import commands

# Create a new Discord bot
token = open('token.txt').readline()
intents = discord.Intents.all()
client = commands.Bot(command_prefix='*', intents = intents)

# Tell us when ready
@client.event
async def on_ready():
    print('Logged in as')
    print(client.user.name)
    print(client.user.id)
    print('------')

# Help Command
@client.command()
async def aide(ctx):
    # Define a list of commands and their descriptions
    commands = {
        "aide": "Affiche tout les commande",
        "vote <question>": "Lance un vote qui s'arrete a 4 votes pour la meme réponse",
        "hltg_all": "Affiche tout les joueurs HTLTG et leur stats",
        "hltg <nom>": "Affiche un joueur HTLTG et ces stats",
        "hltg+ | + <nom> <catégorie>": "Augmente d'un le score de la catégorie définie **DESACTIVER**",
        "hltg- | - <nom> <catégorie>": "Augmente d'un le score de la catégorie définie **DESACTIVER**"
    }

    # Create a message with the list of commands and their descriptions
    message = "Liste des commandes disponible:\n\n"
    for command, description in commands.items():
        message += f"*{command}: {description}\n"

    # Send the message to the channel where the command was invoked
    await ctx.send(message)


# Command to show all players
@client.command()
async def hltg_all(ctx):
    with open('players.json', 'r') as f:
        player_scores = json.load(f)

    embed = discord.Embed(title='Player Scores')
    for player in player_scores:
        name = player['name']
        qui = player['qui']
        feur = player['feur']
        ratio = player['ratio']
        l = player['l']
        total_score = player['totalScore']

        embed.add_field(name=name, value=f'qui: {qui}\nfeur: {feur}\nratio: {ratio}\nl: {l}\ntotal score: {total_score}')

    await ctx.send(embed=embed)

# Command to show specific players
@client.command()
async def hltg(ctx, player_name: str):

    with open('players.json', 'r') as f:
        player_scores = json.load(f)

    embed = discord.Embed(title='Player Scores')
    for player in player_scores:
        if player['name'] == player_name:
            name = player['name']
            qui = player['qui']
            feur = player['feur']
            ratio = player['ratio']
            l = player['l']
            total_score = player['totalScore']

            embed.add_field(name=name, value=f'qui: {qui}\nfeur: {feur}\nratio: {ratio}\nl: {l}\ntotal score: {total_score}')
            break

    await ctx.send(embed=embed)

"""
@client.command(aliases=["hltg+", "+"])
async def hltg_increase_score(ctx, player_name: str, score_name: str):
    with open('players.json', 'r') as f:
        player_scores = json.load(f)

    for player in player_scores:
        if player['name'] == player_name:
            if score_name in ['qui', 'feur', 'ratio', 'l']:
                player[score_name] += 1
                player['totalScore'] += 1

    with open('players.json', 'w') as f:
        json.dump(player_scores, f)

    await ctx.send(f'{player_name}\'s {score_name} score has been increased by 1')


@client.command(aliases=["hltg-", "-"])
async def hltg_decrease_score(ctx, player_name: str, score_name: str):
    with open('players.json', 'r') as f:
        player_scores = json.load(f)

    for player in player_scores:
        if player['name'] == player_name:
            if score_name in ['qui', 'feur', 'ratio', 'l']:
                player[score_name] -= 1
                player['totalScore'] -= 1

    with open('players.json', 'w') as f:
        json.dump(player_scores, f)

    await ctx.send(f'{player_name}\'s {score_name} score has been decreased by 1')
"""

@client.command(aliases=["vote"])
async def poll(ctx, *, question):

    # Create the poll message and add yes/no reactions
    poll_message = await ctx.send(f"Vote: {question} (Oui/Non)")
    await poll_message.add_reaction("✅")
    await poll_message.add_reaction("❌")
    # Create variables to store the number of yes/no votes
    yes_votes = 0
    no_votes = 0

    # Create a while loop that continues until the poll is ended
    while True:
        # Wait for a reaction to be added to the poll message
        reaction, user = await client.wait_for("reaction_add")

        # If the reaction is a "✅" (yes), increment the yes_votes variable
        if reaction.emoji == "✅":
            yes_votes += 1

        # If the reaction is a "❌" (no), increment the no_votes variable
        elif reaction.emoji == "❌":
            no_votes += 1

        # If either of the votes reaches 4, break out of the while loop
        if yes_votes == 4 or no_votes == 4:
            break

    # Send the result of the poll to the channel
    if yes_votes > no_votes:
        user = discord.utils.get(client.users, name="Lambda01", discriminator="9929")
        await ctx.send(f"Fin du vote. Le oui l'emporte. '{question}'  {user.mention}")
    elif yes_votes < no_votes:
        await ctx.send(f"Fin du vote. Le non l'emporte. '{question}'")
    else:
        await ctx.send(f"Fin du vote. Egalité. '{question}'")


client.run(token)
