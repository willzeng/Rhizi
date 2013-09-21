import os
import divisi2
import cherrypy
import sys

class ConceptProvider(object):
  
  def __init__(self, num_axes):
    A = divisi2.network.conceptnet_matrix('en')
    concept_axes, axis_weights, feature_axes = A.svd(k=num_axes)
    self.sim = divisi2.reconstruct_similarity(concept_axes, axis_weights, post_normalize=True)

  def get_related_concepts(self, text, limit):
    return self.sim.row_named(text).top_items(n=limit)

  def get_data(self, text):

    # helper function
    def get_related_nodes(node):
      return [n for (n, x) in self.sim.row_named(node).top_items()]

    # gather concepts and their relatedness as nodes and links

    text = text.lower().strip()
    nodesSet = {text}
    currentLevel = [text]
    numLevels = 3

    for i in xrange(numLevels):
      nextLevel = []
      for node in currentLevel:
        relatedNodes = get_related_nodes(node)
        for relatedNode in relatedNodes:
          if relatedNode not in nodesSet:
            nodesSet.add(relatedNode)
            nextLevel.append(relatedNode)
      currentLevel = nextLevel

    nodesList = list(nodesSet)
    links = []

    for i in xrange(len(nodesList) - 1):
      for j in xrange(i + 1, len(nodesList)):
        n1 = nodesList[i]
        n2 = nodesList[j]
        strength = self.sim.entry_named(n1, n2)
        strength = max(0, strength)
        strength = min(1, strength)
        if strength > .75:
          links.append({'source': i, 
                        'target': j, 
                        'strength': strength})

    nodes = [{'text': node} for node in nodesList]

    return {"nodes": nodes, "links": links}

class Server(object):
  _cp_config = {'tools.staticdir.on' : True,
                'tools.staticdir.dir' : os.path.join(os.getcwd(), "web"),
                'tools.staticdir.index' : 'index.html',
                }

  def __init__(self):
    self.provider = ConceptProvider(100)

  @cherrypy.expose
  @cherrypy.tools.json_out()
  def getrange(self, limit=10):
    return list(range(int(limit)))

  @cherrypy.expose
  @cherrypy.tools.json_out()
  def get_related_concepts(self, text, limit=10):
      return self.provider.get_related_concepts(text, limit)

  @cherrypy.expose
  @cherrypy.tools.json_out()
  def get_data(self, text):
    return self.provider.get_data(text)

cherrypy.config.update({'server.socket_host': '0.0.0.0', 
                         'server.socket_port': int(sys.argv[1]), 
                        }) 

cherrypy.quickstart(Server())
