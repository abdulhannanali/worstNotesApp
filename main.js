(function () {

	var notesModel = {
		init: function () {
			this.notesDB = new Dexie("notesSyncDB")

			this.notesDB
			.version(1)
			.stores({
				notes: "++id, title, description",
				numNotes: "++id, title, description"
			})


			var Note = Dexie.defineClass({
				title: String
			})

			Note.prototype.log = function () {
				console.log(this.title)
				console.log(this.description)
			}


			this.notesDB.notes.mapToClass(Note)
			this.notesDB.numNotes.mapToClass(Note)

			this.notesDB.open()
		

		},
		getAllNotes: function  () {
			return this.notesDB.notes.toArray()
		},
		addNote: function (note) {
			return this.notesDB.notes.add(note)
		},
		searchId: function (id) {
			return this.notesDB.notes.get(id)
		},
		orderByTitle: function () {
			return this.notesDB.notes.orderBy("title").limit(5).toArray()
		},
		deleteNote: function (id) {
			return this.notesDB.notes.delete(id)
		}
	}

	var notesView = {
		init: function () {
			var self = this

			this.notesControl = document.getElementById("notesControl")
			this.notesTitle = document.getElementById("notesTitle")
			this.notesDescription = document.getElementById("notesDescription")
			this.submitBtn = document.getElementById("notesSubmitBtn")

			this.searchIdBtn = document.getElementById("searchIdBtn")
			this.searchText = document.getElementById("searchText")

			this.notesView = document.getElementById("notesView")

			this.deleteBtn = document.getElementById("deleteBtn")
			this.deleteId = document.getElementById("deleteId")

			this.orderByTitle = document.getElementById("orderByTitle")

			this.submitBtn.addEventListener("click", function (event) {
				var note = {
					title: self.notesTitle.value,
					description: self.notesDescription.value
				}

				notesModel.addNote(note)
					.then(function (note) {
						console.log("note has been saved")
						self.render()
					})
			})

			this.searchIdBtn.addEventListener("click", function (event) {
				var id = parseInt(self.searchText.value)
				self.search(id)				
			}, false)

			this.orderByTitle.addEventListener("click", function (event) {
				notesModel.orderByTitle()
					.then(function (notes) {
						console.log(notes)
					})
					.catch(function (error) {
						console.error(error)
					})

			}, false)

			this.deleteBtn.addEventListener("click", function (event) {
				var id = parseInt(self.deleteId.value)
				notesModel.deleteNote(id)
					.then(function (note) {
						console.log(note)
						self.render()
					})
			}, false)


			this.render()
		},
		search: function (id) {
			var notesHTML = ""
			var self = this

			notesModel.searchId(id)
				.then(function (note) {
					if (!note) {
						self.notesView.innerHTML = "No note found for this id"
					}
					notesHTML += `<h2>${note.id}</h2>`
					notesHTML += `<h1>${note.title}</h1>`
					notesHTML += `<p>${note.description}</p>`

					self.notesView.innerHTML = notesHTML
				})

		},
		render: function () {
			notesModel.getAllNotes()
				.then(function (notes) {
					var notesHTML = ""
					notes.forEach(function (note) {
						note.log()
						notesHTML += `<h6>${note.id}</h6>`
						notesHTML +=  `<h1>${note.title}</h1>`
						notesHTML += `<p>${note.description}</p>`
					})
					

					
					this.notesView.innerHTML = notesHTML
				})
				.catch(function (error) {
					alert("Error occured while loading the notes")
				})
		}
	}

	notesModel.init()
	notesView.init()

}())